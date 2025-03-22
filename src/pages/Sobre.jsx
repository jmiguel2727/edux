import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Sobre() {
  useEffect(() => {
    document.title = "Sobre | EDUX";
  }, []);

  return (
    <>
      <Header />

      <div className="container mt-5" style={{ minHeight: "60vh" }}>
        <h1 className="text-center mb-4">Sobre Nós</h1>
        <p>
          Somos o José Menezes e o Tomás Pereira, estudantes de 3.º ano de Informática de Gestão no Instituto Superior de Contabilidade e Administração de Coimbra (ISCAC) 
        – uma instituição de ensino superior com tradição na formação de profissionais qualificados nas áreas de gestão 
          e tecnologia.
        </p>
        <p>
          Este projeto foi desenvolvido no âmbito da unidade curricular de Projeto e Desenvolvimento Informático, 
          que tem como principal objetivo proporcionar aos alunos a oportunidade de aplicar, de forma prática, 
          os conhecimentos adquiridos ao longo do curso. A cadeira desafia-nos a conceber, planear e implementar 
          um website funcional, com utilidade real, que demonstre a nossa capacidade de análise, desenvolvimento 
          e resolução de problemas com recurso às tecnologias mais atuais.
          Foi com esse espírito que nasceu a EDUX, uma plataforma de ensino online desenvolvida de raiz 
          por nós, com o intuito de promover a partilha de conhecimento e facilitar o acesso à aprendizagem digital.
        </p>

        <h2 className="text-center mt-5 mb-3">A Nossa Visão com a EDUX</h2>
        <p>
          A EDUX foi criada com a missão de tornar a formação online mais acessível, flexível e eficaz. Vivemos numa era 
          em que o conhecimento está ao alcance de um clique, e acreditamos que todos devem ter a oportunidade de aprender 
          ao seu ritmo, em qualquer lugar.
          A plataforma pretende ser um ponto de encontro entre formadores, que procuram partilhar os seus conhecimentos, 
          e alunos, que desejam adquirir novas competências de forma prática e certificada. Acreditamos numa educação 
          contínua, relevante e adaptada ao mundo real — e a EDUX representa esse compromisso.
        </p>

        <h2 className="text-center mt-5 mb-3">O Nosso Compromisso</h2>
        <p>
          A EDUX é mais do que um projeto académico — é um reflexo da nossa visão para o futuro da educação. Queremos contribuir 
          para um mundo onde aprender seja uma experiência acessível, envolvente e relevante.
          Este website representa a nossa dedicação, empenho e vontade de fazer diferente. Acreditamos que, com as ferramentas 
          certas, qualquer pessoa pode evoluir, seja profissionalmente, seja pessoalmente.
          Estamos entusiasmados por partilhar este projeto convosco e esperamos que a EDUX seja útil para muitos alunos e formadores, 
          hoje e no futuro.
        </p>
      </div>

      <Footer />
    </>
  );
}

export default Sobre;
