export const SHADOW_SIZE = 20;

export const shadowStyle = {
	shadowOpacity: 0.3,
	shadowOffset: {
		width: 0, height: (SHADOW_SIZE/3),
	},
	shadowColor: '#000',
	shadowRadius: 4,
	elevation: (SHADOW_SIZE/3),
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