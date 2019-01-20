declare module 'image-resizer-js' {
	enum RotateOption {
		None = 0,
		Rotate90 = 1,
		Rotate180 = 2,
		Rotate270 = 3
	}
	
	interface ResizeOptions {
		maxWidth?: number
		maxHeight?: number
		quality?: number
		rotate?: RotateOption
		type?: string
	}
	
	function resize(image: ArrayBuffer, maxWidth?: number, quality?: number, rotate?: RotateOption): Promise<ArrayBuffer>
	function resize(image: ArrayBuffer, options?: ResizeOptions): Promise<ArrayBuffer>

	export default resize
}
