import React from "react";

const Kontakt: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Kontakt</h1>

      <section style={styles.infoSection}>
        <h2>Podaci o firmi</h2>
        <p><strong>Ime firme:</strong> Kafetalog d.o.o.</p>
        <p><strong>Adresa:</strong> Španskih Boraca 18, Beograd</p>
        <p><strong>PIB:</strong> 123456789</p>
      </section>

      <section style={styles.mapSection}>
        <h2>Lokacija radnje</h2>
        <iframe
          title="Lokacija radnje"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.123456789!2d20.457!3d44.816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a6c18f1f4d65b%3A0xa8efab0f0a7dabc!2sBeograd!5e0!3m2!1ssr!2srs!4v1680000000000!5m2!1ssr!2srs"
          width="100%"
          height={300}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <section style={styles.contactSection}>
        <h2>Kontakt telefon / email</h2>
        <p>Telefon: +381 11 123 4567</p>
        <p>Email: kontakt@kafetalog.rs</p>
      </section>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 900,
    margin: "20px auto",
    padding: "0 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  infoSection: {
    marginBottom: 30,
  },
  mapSection: {
    marginBottom: 30,
  },
  contactSection: {
    marginBottom: 30,
  },
};

export default Kontakt;
