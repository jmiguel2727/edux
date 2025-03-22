import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Termos() {
  useEffect(() => {
    document.title = "Termos e Condições | EDUX";
  }, []);

  return (
    <>
      <Header />
      <div className="container mt-5" style={{ minHeight: "60vh" }}>
        <h1 className="text-center mb-4">Termos e Condições | EDUX</h1>

        <h5>1. Aceitação dos Termos</h5>
        <p>Ao aceder ou utilizar a plataforma EDUX, o utilizador concorda em vincular-se aos presentes Termos e Condições. Caso não concorde com algum dos termos, deverá abster-se de utilizar os serviços disponibilizados. Estes termos aplicam-se a todos os utilizadores da plataforma, sejam eles visitantes, alunos, formadores ou administradores. A EDUX reserva-se o direito de alterar estes termos a qualquer momento, sendo da responsabilidade do utilizador consultá-los regularmente.</p>

        <h5>2. Descrição da Plataforma</h5>
        <p>A EDUX é uma plataforma digital destinada à comercialização de cursos e formações online, permitindo que utilizadores se inscrevam em cursos, acedam a conteúdos educativos em vídeo, obtenham certificados digitais e, no caso de formadores, submetam os seus próprios cursos para análise e eventual publicação. A EDUX disponibiliza ainda mecanismos de avaliação, gestão de perfil, pagamento seguro e suporte ao utilizador.</p>

        <h5>3. Registo e Conta de Utilizador</h5>
        <p>Para aceder a funcionalidades completas da plataforma, o utilizador deverá criar uma conta com um e-mail válido e uma palavra-passe segura. O utilizador compromete-se a fornecer informações verídicas e atualizadas, sendo responsável por todas as atividades realizadas sob a sua conta. O utilizador deve notificar imediatamente a EDUX em caso de suspeita de acesso não autorizado ou violação de segurança.</p>
        <p>O uso de nomes de utilizador ofensivos, enganosos ou que violem direitos de terceiros é proibido. A EDUX reserva-se o direito de suspender ou eliminar contas que violem estes termos.</p>

        <h5>4. Direitos e Obrigações dos Utilizadores</h5>

        <h6>4.1 Alunos</h6>
        <p>Os alunos podem:</p>
        <ul>
          <li>Pesquisar e inscrever-se em cursos gratuitos ou pagos;</li>
          <li>Acompanhar o progresso de aprendizagem;</li>
          <li>Obter certificados após conclusão dos cursos;</li>
          <li>Avaliar e comentar cursos frequentados;</li>
          <li>Gerir os seus dados pessoais e métodos de pagamento.</li>
        </ul>
        <p>Os alunos comprometem-se a:</p>
        <ul>
          <li>Utilizar os conteúdos exclusivamente para fins pessoais e educativos;</li>
          <li>Não partilhar, copiar, distribuir ou revender os conteúdos sem autorização;</li>
          <li>Agir de forma ética e respeitosa na plataforma.</li>
        </ul>

        <h6>4.2 Formadores</h6>
        <p>Os formadores podem:</p>
        <ul>
          <li>Criar e submeter cursos para análise;</li>
          <li>Gerir os conteúdos dos seus cursos (vídeos, descrições, ficheiros complementares);</li>
          <li>Acompanhar o estado de aprovação e as avaliações dos seus cursos.</li>
        </ul>
        <p>Os formadores comprometem-se a:</p>
        <ul>
          <li>Garantir que os conteúdos são originais ou devidamente licenciados;</li>
          <li>Não publicar conteúdos ofensivos, discriminatórios, plagiados ou que infrinjam direitos de terceiros;</li>
          <li>Manter os conteúdos atualizados e com qualidade pedagógica.</li>
        </ul>

        <h6>4.3 Administradores</h6>
        <p>Os administradores da plataforma têm a responsabilidade de:</p>
        <ul>
          <li>Validar e aprovar cursos submetidos;</li>
          <li>Remover conteúdos ou contas que violem os termos;</li>
          <li>Garantir o bom funcionamento técnico e a segurança da plataforma;</li>
          <li>Prestar apoio aos utilizadores sempre que necessário.</li>
        </ul>

        <h5>5. Conteúdos da Plataforma</h5>
        <p>Os conteúdos disponibilizados na EDUX, incluindo textos, vídeos, imagens, gráficos, logótipos e software, são protegidos por direitos de autor e propriedade intelectual. Nenhum conteúdo poderá ser reproduzido, distribuído ou utilizado sem autorização prévia da EDUX ou do respetivo autor.</p>
        <p>A EDUX não se responsabiliza por conteúdos gerados por utilizadores, mas reserva-se o direito de os remover caso estes sejam considerados inadequados, ilícitos ou contrários aos princípios da plataforma.</p>

        <h5>6. Pagamentos e Política de Reembolsos</h5>
        <p>As transacções financeiras são realizadas através de plataformas seguras, como PayPal e MBWay. O utilizador compromete-se a fornecer informações de pagamento válidas e a garantir fundos suficientes para completar a transação.</p>
        <p>Os cursos pagos não são reembolsáveis, exceto nos seguintes casos:</p>
        <ul>
          <li>Curso com defeitos técnicos ou conteúdos ausentes;</li>
          <li>Cancelamento da compra dentro de um prazo de 14 dias, desde que o curso ainda não tenha sido iniciado.</li>
        </ul>
        <p>Todos os pedidos de reembolso devem ser enviados para o suporte da plataforma, sendo analisados caso a caso.</p>

        <h5>7. Certificados Digitais</h5>
        <p>Após a conclusão de um curso, o aluno poderá descarregar um certificado digital de participação, que atesta a sua conclusão com sucesso. Os certificados são gerados automaticamente pela plataforma e não substituem formações académicas formais, a menos que indicado em contrário.</p>

        <h5>8. Privacidade e Proteção de Dados</h5>
        <p>A EDUX cumpre rigorosamente o Regulamento Geral sobre a Proteção de Dados (RGPD). Os dados pessoais recolhidos serão utilizados apenas para efeitos operacionais, de comunicação e melhoria da experiência do utilizador, não sendo partilhados com terceiros sem o consentimento do titular.</p>
        <p>O utilizador tem o direito de aceder, corrigir, eliminar ou limitar o tratamento dos seus dados pessoais, podendo exercer esses direitos contactando o nosso suporte.</p>

        <h5>9. Segurança da Plataforma</h5>
        <p>A EDUX implementa medidas técnicas e organizativas para garantir a segurança da informação, incluindo:</p>
        <ul>
          <li>Encriptação de dados;</li>
          <li>Autenticação de dois fatores;</li>
          <li>Limitação de tentativas de login;</li>
          <li>Backups diários.</li>
        </ul>
        <p>A EDUX não se responsabiliza por falhas técnicas alheias à sua infraestrutura ou por ações de terceiros que comprometam o sistema, embora envidará todos os esforços para os prevenir.</p>

        <h5>10. Conduta Proibida</h5>
        <p>É estritamente proibido:</p>
        <ul>
          <li>Utilizar a plataforma para fins fraudulentos ou ilegais;</li>
          <li>Violar direitos de propriedade intelectual de terceiros;</li>
          <li>Distribuir malware ou tentar aceder a partes restritas do sistema;</li>
          <li>Assediar, insultar ou prejudicar outros utilizadores.</li>
        </ul>
        <p>O incumprimento poderá levar à suspensão ou encerramento da conta, sem direito a reembolso.</p>

        <h5>11. Alterações aos Termos e Condições</h5>
        <p>A EDUX reserva-se o direito de atualizar os presentes termos sempre que necessário. As alterações serão comunicadas através da plataforma ou por e-mail. A continuação de utilização da plataforma após a publicação das alterações será considerada como aceitação dos novos termos.</p>
      </div>
      <Footer />
    </>
  );
}

export default Termos;

