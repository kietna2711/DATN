import styles from "../styles/productitem.module.css";

export default function InstagramSection() {
  return (
    <section className={styles.instagram_section}>
      <div className={styles.instagram_container}>
        <div className={styles.instagram_header}>
          <div className={styles.instagram_title}>
            @MiMiBear
          </div>
          <a
            href="https://www.instagram.com/mimivear"
            target="_blank"
            rel="noopener"
            className={styles.instagram_btn}
          >
            THEO DÕI INSTAGRAM MIMIVEAR
            <svg style={{ marginLeft: 10 }} width="16" height="16" fill="none" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7.25" stroke="#231f20" strokeWidth="1.5"/>
              <circle cx="8" cy="8" r="3.5" stroke="#231f20" strokeWidth="1.5"/>
              <circle cx="12.25" cy="3.75" r="0.75" fill="#231f20"/>
            </svg>
          </a>
        </div>
        <div className={styles.instagram_main}>
          <div className={styles.instagram_left}>
            <img src="http://localhost:3000/images/image63.png" alt="MiMiBear Quà 1/6" className={styles.instagram_bigimg} />
          </div>
          <div className={styles.instagram_right}>
            <div className={styles["instagram-grid"]}>
              {[...Array(8)].map((_, i) => (
                <img key={i} src="http://localhost:3000/images/image64.png" alt="MiMiBear" />
              ))}
            </div>
          </div>
        </div>
        <div className={styles.instagram_quote_block}>
          <div className={styles.instagram_quote}>
            "MiMiBear – Từ những chú gấu bông đầu tiên<br />
            đến thương hiệu được hàng ngàn khách hàng yêu mến"
          </div>
          <div className={styles.instagram_dots}>
            <span className={`${styles.instagram_dot} ${styles.active}`}></span>
            <span className={`${styles.instagram_dot} ${styles.inactive}`}></span>
          </div>
        </div>
      </div>
    </section>
  );
}