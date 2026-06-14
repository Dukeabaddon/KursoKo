/**
 * Gray placeholder for art not yet produced.
 * Replace the whole block with img/illustration when assets are ready.
 */
const AssetPlaceholder = ({
  label,
  shortLabel,
  aspectRatio,
  fill = false,
  className = '',
  minHeight
}) => {
  const visible = shortLabel || label

  return (
    <div
      className={`flex items-center justify-center rounded-xl border-2 border-dashed border-neutral-400 bg-neutral-300/70 p-4 text-center ${
        fill ? 'h-full w-full' : ''
      } ${className}`}
      style={{
        aspectRatio: fill ? undefined : aspectRatio || undefined,
        minHeight: minHeight || undefined
      }}
      role="img"
      aria-label={label}
      title={label}
    >
      <span className="max-w-[16rem] text-xs font-semibold uppercase leading-snug tracking-wide text-neutral-600 sm:text-sm">
        {visible}
      </span>
    </div>
  )
}

export default AssetPlaceholder
