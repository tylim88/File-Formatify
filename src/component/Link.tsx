import { Link as Link_ } from '@tanstack/react-router'

export const Link: typeof Link_ = ({ style, ...props }) => {
	return <Link_ {...props} style={{ textDecoration: 'none', ...style }} />
}
