import { convertCSSLength } from '@/utils'
import { useWindowWidth } from '@react-hook/window-size'
import { DEFAULT_THEME } from '@mantine/core'

export const useIsSmallestBreakpoint = () => {
	const width = useWindowWidth()
	const widthEM = convertCSSLength(`${width}px`, 'em')
	return widthEM < DEFAULT_THEME.breakpoints.xs
}
