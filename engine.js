
class Color{
	constructor(resolvableColor){
		let rgb = Color.resolve(resolvableColor)
		this.confirmed = rgb ? true : false
		this.red = this.confirmed ? rgb[0] : 0
		this.green = this.confirmed ? rgb[1] : 0
		this.blue = this.confirmed ? rgb[2] : 0
	}
	fusion(color,fraction){
		return new Color(this.rgb.map((c,i)=>{
			return map(fraction,0,1,c,color.rgb[i])
		}))
	}
	toString(type){
		if(type === 'rgb'){
			return this.rgb.toString()
		}
		return this.hex
	}
	get isColor(){
		return this.confirmed
	}
	get rgb(){
		return [this.red,this.green,this.blue]
	}
	get hex(){
		return Color.rgbToHex(this.rgb)
	}
	static gradient(colors,length){
		let array = []
		let section = length / (colors.length-1)
		for (var i=0; i<length; i++) {
			if(colors.length > 1){
				let c = Math.floor(i/section)
				array.push(
					colors[c].fusion(
						colors[c+1],
						map(i-(c*section),0,section,0,1)
					)
				)
			}else if(colors.length > 0){
				array.push(colors[0])
			}
		}
		return array
	}
	static resolve(resolvableColor){
		if(!resolvableColor)return false;
		if(typeof resolvableColor === "string"){
			let rgb = Color.hexToRgb(resolvableColor)
			if(rgb){
				return rgb
			}
		}else if(Array.isArray(resolvableColor)){
			let rgb = resolvableColor.filter(c=>{
				return !isNaN(c) && c>=0 && c<=255
			})
			if(rgb.length===3){
				return rgb
			}
		}else if(
			typeof resolvableColor === "object"
			&& resolvableColor.isColor
		){
			return resolvableColor.rgb
		}
		return false
	}
	static random(){
		return new Color([
			Math.floor(Math.random()*255),
			Math.floor(Math.random()*255),
			Math.floor(Math.random()*255)
		])
	}
	static rgbToHex(rgb) {
		return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
	}
	static hexToRgb(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? [
	        parseInt(result[1], 16),
	        parseInt(result[2], 16),
	        parseInt(result[3], 16)
	    ] : null;
	}
}

module.exports = Color

function map(value, start1, stop1, start2, stop2) {
    return 1.0 * start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}