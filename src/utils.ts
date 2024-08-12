// @ts-expect-error this library is too old
import convertLength from 'convert-css-length'

export const convertCSSLength = convertLength(
	parseFloat(getComputedStyle(document.body).fontSize)
)

export const isChromium = () => {
	const ua = navigator.userAgent
	const isChromium = ua.includes('Chrome') || ua.includes('Chromium')
	const isEdge = ua.includes('Edg')
	const isOpera = ua.includes('OPR')
	const isBrave = ua.includes('Brave')

	return isChromium && !isEdge && !isOpera && !isBrave
}

export const download = ({
	href,
	outputPath,
}: {
	href: string
	outputPath: string
}) => {
	const link = document.createElement('a')
	link.href = href
	link.setAttribute('download', outputPath)
	document.body.appendChild(link)
	link.click()
	return link
}
