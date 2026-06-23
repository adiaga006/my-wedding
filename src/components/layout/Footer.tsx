export default function Footer() {
  return (
    <footer
      className="bg-charcoal text-cream py-12 sm:py-16 px-5 text-center"
      style={{ paddingBottom: 'max(3rem, calc(2rem + env(safe-area-inset-bottom)))' }}
    >
      <p className="font-serif text-3xl sm:text-4xl italic text-blush mb-2">Duy &amp; Chi</p>
      <p className="font-sans text-xs tracking-widest uppercase text-cream/40 mb-6">
        Mãi mãi bên nhau
      </p>
      <div className="w-12 h-px bg-blush/20 mx-auto mb-6" />
      <p className="font-sans text-xs text-cream/30">Made with ♥ by Duy &amp; Chi</p>
    </footer>
  )
}
