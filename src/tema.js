import { createTheme, defaultVariantColorsResolver, rem } from '@mantine/core';

// Paleta oficial do design system Altterra (tons 0-9 no padrão Mantine).
const ESCALA_VERDE = [
  '#f3f7f3',
  '#dbe7da',
  '#b1cbaf',
  '#7ca979',
  '#62975e',
  '#527d4f',
  '#41643f',
  '#334e31',
  '#1d2c1b',
  '#101910',
];

const ESCALA_DOURADO = [
  '#fcf7e8',
  '#f9ecc8',
  '#f4dc9a',
  '#edcb6e',
  '#fac72e',
  '#e3b331',
  '#deac21',
  '#b68e20',
  '#876b1c',
  '#5b4815',
];

const ESCALA_CINZA = [
  '#fafafa',
  '#f2f2f2',
  '#e6e6e6',
  '#d4d4d4',
  '#adadad',
  '#8a8a8a',
  '#6b6b6b',
  '#4f4f4f',
  '#333333',
  '#161816',
];

const ESCALA_ERRO = [
  '#fdf0ed',
  '#fbdad3',
  '#f2b3a6',
  '#ea8975',
  '#e25f45',
  '#da4021',
  '#d22605',
  '#a81f04',
  '#841803',
  '#5e1102',
];

const ESCALA_INFO = [
  '#eef4fa',
  '#d8e6f5',
  '#a9c6e6',
  '#7ba7d7',
  '#538bc8',
  '#3b78bc',
  '#2b6cb0',
  '#22578e',
  '#19426c',
  '#112c49',
];

const ESCALA_SUCESSO = [
  '#f3f7f3',
  '#dbe7da',
  '#b1cbaf',
  '#7ca979',
  '#599254',
  '#427f3d',
  '#357231',
  '#2b5d28',
  '#1f441d',
  '#142c13',
];

// Camadas exclusivas da navbar e do rodapé escuros (fora da escala principal).
const ESCALA_BARRA = [
  '#dbe7da',
  '#b1cbaf',
  '#7ca979',
  '#4a7048',
  '#3e5d3c',
  '#3a5738',
  '#395837',
  '#2f482e',
  '#2d442c',
  '#293e28',
];

// Fixa as cores das variantes light, filled e subtle para respeitar o contraste aprovado.
function resolverCoresVariante(entrada) {
  const padrao = defaultVariantColorsResolver(entrada);

  if (entrada.variant === 'light' && entrada.color === 'verde') {
    return {
      ...padrao,
      background: ESCALA_VERDE[0],
      hover: ESCALA_VERDE[1],
      color: ESCALA_VERDE[8],
      border: '1px solid transparent',
    };
  }

  if (entrada.variant === 'subtle' && entrada.color === 'verde') {
    return {
      ...padrao,
      background: 'transparent',
      hover: ESCALA_VERDE[0],
      color: ESCALA_VERDE[7],
      border: '1px solid transparent',
    };
  }

  if (entrada.variant === 'filled' && entrada.color === 'erro') {
    return {
      ...padrao,
      background: ESCALA_ERRO[6],
      hover: ESCALA_ERRO[7],
      color: '#ffffff',
      border: '1px solid transparent',
    };
  }

  return padrao;
}

// Tema principal do Mantine para toda a aplicação Altterra.
export const temaAltterra = createTheme({
  primaryColor: 'verde',
  primaryShade: 7,
  white: '#ffffff',
  black: '#161816',
  focusRing: 'auto',
  fontFamily: "'Cal Sans UI', system-ui, -apple-system, sans-serif",
  headings: {
    fontFamily: "'Cal Sans UI Text', 'Cal Sans UI', system-ui, sans-serif",
    fontWeight: '700',
    sizes: {
      h1: { fontSize: rem(36), lineHeight: rem(44) },
      h2: { fontSize: rem(28), lineHeight: rem(36) },
      h3: { fontSize: rem(22), lineHeight: rem(28), fontWeight: '600' },
      h4: { fontSize: rem(18), lineHeight: rem(26), fontWeight: '600' },
    },
  },
  colors: {
    verde: ESCALA_VERDE,
    dourado: ESCALA_DOURADO,
    cinza: ESCALA_CINZA,
    erro: ESCALA_ERRO,
    info: ESCALA_INFO,
    sucesso: ESCALA_SUCESSO,
    barra: ESCALA_BARRA,
  },
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  radius: {
    sm: rem(8),
    md: rem(8),
    lg: rem(16),
    xl: rem(9999),
  },
  defaultRadius: 'sm',
  shadows: {
    sm: '0 8px 24px rgba(22, 24, 22, 0.12)',
    md: '0 8px 24px rgba(22, 24, 22, 0.12)',
    lg: '0 8px 24px rgba(16, 25, 16, 0.32)',
  },
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '64em',
    lg: '80em',
    xl: '88em',
  },
  variantColorResolver: resolverCoresVariante,
  components: {
    Button: {
      defaultProps: {
        radius: 'xl',
        size: 'md',
        color: 'verde',
      },
      vars: (_theme, props) => {
        if (props.size === 'lg') {
          return {
            root: {
              '--button-height': rem(64),
              '--button-padding-x': rem(32),
              '--button-fz': rem(18),
            },
          };
        }
        if (props.size === 'sm') {
          return {
            root: {
              '--button-height': rem(44),
              '--button-padding-x': rem(16),
              '--button-fz': rem(14),
            },
          };
        }
        return {
          root: {
            '--button-height': rem(56),
            '--button-padding-x': rem(24),
            '--button-fz': rem(16),
          },
        };
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: 'xl',
        size: 'md',
        variant: 'light',
        color: 'verde',
      },
      vars: (_theme, props) => {
        if (props.size === 'lg') {
          return { root: { '--ai-size': rem(64) } };
        }
        if (props.size === 'sm') {
          return { root: { '--ai-size': rem(44) } };
        }
        return { root: { '--ai-size': rem(56) } };
      },
    },
    Input: {
      defaultProps: {
        radius: 'sm',
        size: 'md',
      },
      vars: (_theme, props) => {
        if (props.size === 'sm') {
          return { wrapper: { '--input-height': rem(44) } };
        }
        return { wrapper: { '--input-height': rem(56) } };
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'sm',
        size: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'sm',
        size: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'sm',
        size: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        withBorder: true,
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        centered: true,
        overlayProps: {
          color: ESCALA_VERDE[9],
          backgroundOpacity: 0.5,
        },
      },
    },
    Drawer: {
      defaultProps: {
        radius: 'lg',
        overlayProps: {
          color: ESCALA_VERDE[9],
          backgroundOpacity: 0.5,
        },
      },
    },
  },
});
