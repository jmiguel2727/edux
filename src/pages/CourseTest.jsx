import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CourseTest() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: answerId }
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { score, passed }

  useEffect(() => {
    const fetchTestData = async () => {
      setLoading(true);
      try {
        const { data: tests } = await supabase
          .from("course_tests")
          .select("id")
          .eq("course_id", courseId)
          .limit(1);

        if (!tests || tests.length === 0) {
          alert("Teste não encontrado para este curso.");
          navigate(`/curso/${courseId}`);
          return;
        }

        const testId = tests[0].id;

        const { data: qs } = await supabase
          .from("course_questions")
          .select(`id, question, course_answers(id, answer)`)
          .eq("test_id", testId)
          .order("id", { ascending: true });

        if (!qs || qs.length === 0) {
          alert("Nenhuma pergunta encontrada no teste.");
          navigate(`/curso/${courseId}`);
          return;
        }

        setQuestions(qs);
      } catch (error) {
        console.error("Erro ao carregar o teste:", error);
      }
      setLoading(false);
    };

    fetchTestData();
  }, [courseId, navigate]);

  const handleSelectAnswer = (questionId, answerId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Por favor, responde a todas as perguntas antes de submeter.");
      return;
    }

    setSubmitting(true);

    try {
      const questionIds = questions.map((q) => q.id);
      const { data: correctAnswers } = await supabase
        .from("course_answers")
        .select("id, question_id, is_correct")
        .in("question_id", questionIds);

      let score = 0;
      for (const q of questions) {
        const selectedAnswerId = answers[q.id];
        const correct = correctAnswers.find(
          (a) => a.question_id === q.id && a.id === selectedAnswerId && a.is_correct
        );
        if (correct) score += 1;
      }

      const passThreshold = 7;
      const passed = score >= passThreshold;

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) {
        alert("Sessão inválida. Por favor, inicie sessão novamente.");
        setSubmitting(false);
        return;
      }

      const { data: tests } = await supabase
        .from("course_tests")
        .select("id")
        .eq("course_id", courseId)
        .limit(1);
      const testId = tests[0].id;

      const { data: existingResult } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_id", user.id)
        .eq("test_id", testId)
        .maybeSingle();

      if (existingResult) {
        await supabase
          .from("test_results")
          .update({ score, passed, completed_at: new Date() })
          .eq("id", existingResult.id);
      } else {
        await supabase
          .from("test_results")
          .insert({ user_id: user.id, test_id: testId, score, passed, completed_at: new Date() });
      }

      setResult({ score, passed });
    } catch (error) {
      console.error("Erro ao submeter o teste:", error);
      alert("Erro ao submeter o teste. Tenta novamente.");
    }

    setSubmitting(false);
  };

  if (loading) return <p>A carregar teste...</p>;

  if (result) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <h2>Resultado do Teste</h2>
          <p>
            Obtiveste {result.score} de {questions.length} pontos.
          </p>
          {result.passed ? (
            <p className="text-success">Parabéns! Passaste o teste.</p>
          ) : (
            <p className="text-danger">Não passaste. Tenta novamente.</p>
          )}
            <button className="btn btn-primary" onClick={() => navigate(`/curso/${courseId}/conteudo`)}>
            Voltar ao curso
            </button>

        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5">
        <h2>Teste Final do Curso</h2>
        <form>
          {questions.map((q) => (
            <div key={q.id} className="mb-4">
              <p><strong>{q.question}</strong></p>
              {q.course_answers.map((a) => (
                <div key={a.id} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${q.id}`}
                    id={`answer-${a.id}`}
                    value={a.id}
                    checked={answers[q.id] === a.id}
                    onChange={() => handleSelectAnswer(q.id, a.id)}
                  />
                  <label className="form-check-label" htmlFor={`answer-${a.id}`}>
                    {a.answer}
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "A Submeter..." : "Submeter Teste"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
