import landingImg from '../img/LandingPageImg.jpg';

const steps = [
  {
    number: 1,
    title: "Cadastre sua Renda",
    description: "Informe sua renda mensal e objetivos financeiros."
  },
  {
    number: 2,
    title: "Receba Recomendações",
    description: "Nosso sistema analisa e sugere as melhores opções de investimento."
  },
  {
    number: 3,
    title: "Acompanhe seu Progresso",
    description: "Monitore seus investimentos e conquiste sua liberdade financeira."
  }
];

function HowItWorks() {
  return (
    <>
      <style>{`
        .how-section {
          padding: 80px 40px;
          background: #fff;
        }

        .how-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 60px;
          max-width: 1200px;
          margin: auto;
        }

        .how-image {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .how-image img {
          width: 100%;
          max-width: 500px;
          border-radius: 20px;
          object-fit: cover;
        }

        .how-content {
          flex: 1;
        }

        .how-title {
          font-size: clamp(24px, 3vw, 36px);
          margin: 0 0 30px;
          color: #0f172a;
          font-weight: 700;
        }

        .step {
          display: flex;
          align-items: flex-start;
          margin-bottom: 25px;
          gap: 16px;
        }

        .step-number {
          width: 40px;
          height: 40px;
          min-width: 40px;
          background: #3b3b98;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 15px;
        }

        .step-title {
          margin: 0;
          font-size: clamp(15px, 1.4vw, 18px);
          color: #0f172a;
          font-weight: 700;
        }

        .step-desc {
          margin: 4px 0 0;
          font-size: clamp(13px, 1.2vw, 15px);
          color: #555;
          line-height: 1.55;
        }

        /* Tablet: imagem em cima, conteúdo embaixo */
        @media (max-width: 820px) {
          .how-section { padding: 60px 24px; }
          .how-container {
            flex-direction: column;
            gap: 40px;
          }
          .how-image { width: 100%; }
          .how-image img { max-width: 100%; }
          .how-content { width: 100%; }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .how-section { padding: 48px 16px; }
        }
      `}</style>

      <section className="how-section">
        <div className="how-container">

          <div className="how-image">
            <img src={landingImg} alt="Investimentos" />
          </div>

          <div className="how-content">
            <h2 className="how-title">Como Funciona?</h2>

            {steps.map((step) => (
              <div key={step.number} className="step">
                <div className="step-number">{step.number}</div>
                <div>
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

export default HowItWorks;