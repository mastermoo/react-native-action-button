export const SHADOW_SIZE = 10;

export const shadowStyle = {
	shadowOpacity: 0.35,
	shadowOffset: {
		width: 0, height: 5,
	},
	shadowColor: '#000',
	shadowRadius: 3,
	elevation: 5,
};

export const alignItemsMap = {
	center: "center",
	left: "flex-start",
	right: "flex-end"
};

export const positionMap = (position, orientation) => {
	const topOrBottom = orientation === 'up' ? 'bottom' : 'top';

	const style = {
		[topOrBottom]: -SHADOW_SIZE
	};

	if (position !== 'center') style[position] = -SHADOW_SIZE;

	return style;
};