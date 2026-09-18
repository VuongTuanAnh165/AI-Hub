export default defineAppConfig({
  ui: {
    colors: {
      primary: 'violet',
      secondary: 'cyan',
      success: 'emerald',
      error: 'rose',
      neutral: 'zinc'
    },
    input: {
      default: {
        size: 'lg',
        color: 'gray'
      },
      base: 'transition-all duration-300 focus:ring-2 focus:ring-primary-500/50',
      rounded: 'rounded-xl'
    },
    button: {
      rounded: 'rounded-xl'
    },
    card: {
      rounded: 'rounded-2xl'
    }
  }
})
