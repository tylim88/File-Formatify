import { Link as Link_ } from '@tanstack/react-router'

export const Link: typeof Link_ = ({ style, ...props }) => {
	// @ts-expect-error ...
	return <Link_ {...props} style={{ textDecoration: 'none', ...style }} />
}
