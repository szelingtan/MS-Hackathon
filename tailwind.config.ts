import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				plant: {
					base: 'hsl(var(--plant-base))',
					growth: 'hsl(var(--plant-growth))',
					bloom: 'hsl(var(--plant-bloom))'
				},
				water: 'hsl(var(--water-droplet))',
				earth: 'hsl(var(--earth-brown))',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-earth': 'var(--gradient-earth)',
				'gradient-growth': 'var(--gradient-growth)',
				'gradient-sky': 'var(--gradient-sky)',
				'gradient-water': 'var(--gradient-water)'
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'plant': 'var(--shadow-plant)',
				'growth': 'var(--shadow-growth)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'plant-grow': {
					'0%': { 
						transform: 'scale(0.8) translateY(10px)',
						opacity: '0.7'
					},
					'100%': { 
						transform: 'scale(1) translateY(0)',
						opacity: '1'
					}
				},
				'water-drop': {
					'0%': { 
						transform: 'translateY(-20px) scale(0)',
						opacity: '0'
					},
					'50%': {
						transform: 'translateY(0) scale(1)',
						opacity: '1'
					},
					'100%': { 
						transform: 'translateY(10px) scale(0.8)',
						opacity: '0'
					}
				},
				'leaf-sway': {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'50%': { transform: 'rotate(3deg)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'plant-grow': 'plant-grow 1.5s ease-out',
				'water-drop': 'water-drop 2s ease-in-out infinite',
				'leaf-sway': 'leaf-sway 3s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
