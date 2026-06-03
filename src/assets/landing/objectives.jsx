import favoriteIcon from '../img/icons/favorite.svg'
import calculatorIcon from '../img/icons/calculator.svg'
import hatIcon from '../img/icons/hat.svg'

const cards = [
  {
    title: "Educação Financeira",
    description: "Aprenda a realizar melhores investimentos no futuro com nossos guias e ferramentas educacionais.",
    iconFile: hatIcon,
    color: "#DBEAFE",
  },
  {
    title: "Simulador Personalizado",
    description: "Simule investimentos com base na sua renda mensal e descubra as melhores oportunidades.",
    iconFile: calculatorIcon,
    color: "#D1FAE5",
  },
  {
    title: "Gestão de Dívidas",
    description: "Facilite sua vida financeira com ferramentas para organizar e eliminar suas dívidas.",
    iconFile: favoriteIcon,
    color: "#FEE2E2",
  },
]

const styles = {
  section: {
    background: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 24px",
    width: "100%",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#101828",
    margin: "0 0 12px",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "15px",
    color: "#4a5565",
    fontWeight: "400",
    margin: "0 0 40px",
    textAlign: "center",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "28px 24px 32px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.07)",
    display: "flex",
    flexDirection: "column",
  },
  iconWrap: (color) => ({
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    flexShrink: 0,
  }),
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#101828",
    margin: "0 0 10px",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#4a5565",
    lineHeight: "1.65",
    margin: 0,
  },
}

function ObjectiveCard({ title, description, iconFile, color }) {
  return (
    <div style={styles.card}>
      <div style={styles.iconWrap(color)}>
        <img src={iconFile} alt="" style={{ width: "24px", height: "24px" }} />
      </div>
      <p style={styles.cardTitle}>{title}</p>
      <p style={styles.cardDesc}>{description}</p>
    </div>
  )
}

function Objectives() {
  return (
    <>
      <style>{`
        .objectives-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 960px;
        }
        @media (max-width: 900px) {
          .objectives-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .objectives-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section style={styles.section}>
        <h1 style={styles.title}>Nossos Objetivos</h1>
        <p style={styles.subtitle}>
          Três pilares fundamentais para sua jornada rumo à prosperidade financeira
        </p>
        <div className="objectives-grid">
          {cards.map((card) => (
            <ObjectiveCard key={card.title} {...card} />
          ))}
        </div>
      </section>
    </>
  )
}

export default Objectives