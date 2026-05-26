import { useEffect, useRef, useState } from 'react';
const TableCell = ({ isDragging, children, ...rest }) => {
	const ref = useRef(null);
	const [snapshot, setSnapshot] = useState(null);

	useEffect(() => {
		if (ref.current) {
			const { width, height } = ref.current.getBoundingClientRect();
			setSnapshot({ width, height });
		}
	}, [isDragging]);

	useEffect(() => {
		const cellRef = ref.current;
		if (!cellRef) {
			return;
		}

		if (snapshot) {
			if (cellRef.style.width === `${snapshot.width}px`) {
				return;
			}
			cellRef.style.width = `${snapshot.width}px`;
			cellRef.style.height = `${snapshot.height}px`;
		} else if (!isDragging) {
			if (cellRef.style.width != null) {
				cellRef.style.removeProperty('height');
				cellRef.style.removeProperty('width');
			}
		}
	}, [snapshot, isDragging]);

	return (
		<td ref={ref} {...rest}>
			{children}
		</td>
	);
};
export default TableCell;
