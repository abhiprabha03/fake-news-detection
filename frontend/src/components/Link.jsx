import { navigateTo, withBase } from '../lib/routes'

// Internal link: a real <a> (so middle-click and "open in new tab" work)
// that switches pages without reloading.
export default function Link({ to, onClick, children, ...props }) {
  const handleClick = (event) => {
    onClick?.(event)
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    if (event.defaultPrevented || event.button !== 0 || modified) return
    event.preventDefault()
    navigateTo(to)
  }

  return (
    <a href={withBase(to)} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
