import Link from 'next/link';
import styles from './EditorialInfoPage.module.css';

export default function EditorialInfoPage({
  eyebrow,
  title,
  intro,
  navigation,
  sections,
  callout,
}) {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.intro}>{intro}</p>
      </header>

      {navigation?.length > 0 && (
        <nav className={styles.navigation} aria-label="Page sections">
          {navigation.map(item => (
            <a href={item.href} key={item.href}>{item.label}</a>
          ))}
        </nav>
      )}

      {sections.map(section => (
        <section
          className={styles.section}
          id={section.id}
          key={section.id}
          aria-labelledby={`${section.id}-title`}
        >
          <header className={styles.sectionHeading}>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            {section.subtitle && <p>{section.subtitle}</p>}
          </header>

          {section.paragraphs && (
            <div className={styles.copy}>
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>
          )}

          {section.items && (
            <div className={styles.rows}>
              {section.items.map((item, index) => item.question ? (
                <details className={styles.question} key={item.question} open={index === 0}>
                  <summary>
                    <span>{item.question}</span>
                    <span className={styles.toggle} aria-hidden="true" />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ) : (
                <div className={styles.infoRow} key={item.label}>
                  <h3>{item.label}</h3>
                  <div>{item.content}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {callout && (
        <section className={styles.callout} aria-labelledby="editorial-callout-title">
          <p className={styles.eyebrow}>{callout.eyebrow}</p>
          <h2 id="editorial-callout-title">{callout.title}</h2>
          <p className={styles.calloutDescription}>{callout.description}</p>
          <div className={styles.actions}>
            {callout.actions.map(action => {
              const className = action.secondary ? styles.secondaryAction : styles.action;
              return action.href.startsWith('/') ? (
                <Link className={className} href={action.href} key={action.label}>
                  {action.label}
                </Link>
              ) : (
                <a className={className} href={action.href} key={action.label}>
                  {action.label}
                </a>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
