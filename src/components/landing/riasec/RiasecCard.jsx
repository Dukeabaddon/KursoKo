export function RiasecCard({ item }) {
  return (
    <article
      className="flex h-full flex-col items-center text-center"
      style={{ '--tile-accent': item.color }}
    >
      <img
        src={item.src}
        alt={`${item.label} — ${item.hint} RIASEC type`}
        className="block h-[clamp(9.5rem,28vw,11rem)] w-[clamp(9.5rem,28vw,11rem)] object-contain md:h-[clamp(11rem,16vw,14rem)] md:w-[clamp(11rem,16vw,14rem)]"
        width={224}
        height={224}
        loading="lazy"
        decoding="async"
      />
      <div className="mt-3 max-w-[17rem]">
        <h3 className="m-0 flex flex-wrap items-center justify-center gap-1.5 font-display text-[0.9375rem] font-bold text-landing-ink">
          <span className="landing-riasec-tile__code" aria-hidden="true">
            {item.code}
          </span>
          {item.label}
        </h3>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-landing-muted md:text-sm">
          {item.description}
        </p>
      </div>
    </article>
  )
}
