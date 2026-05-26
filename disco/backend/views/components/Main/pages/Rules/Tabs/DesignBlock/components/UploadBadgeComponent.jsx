import { useState, useRef, useCallback } from 'react';
import {
	useUploadImageMutation,
	useDeleteImageMutation,
	useGetUploadedImagesQuery,
} from '../../../../../features/imageUpload/imageUploadApi';
import ImageDropZone from './ImageDropZone';
import ImagePreview from './ImagePreview';

const UploadBadgeComponent = ({
	title = 'Upload Your Badge',
	placeholderText = 'Drag or drop your image',
	uploadType = 'product-badge',
	handleUploadBadgeSelect = () => {},
	selectedDesign = null,
}) => {
	const [preview, setPreview] = useState(null);
	const [pendingFile, setPendingFile] = useState(null);
	const fileInputRef = useRef(null);

	const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
	const [deleteImage] = useDeleteImageMutation();
	const { data: uploadedImages = [], isLoading: isLoadingImages } =
		useGetUploadedImagesQuery(uploadType);

	const handleFileSelect = useCallback((file) => {
		const imageUrl = URL.createObjectURL(file);
		setPreview(imageUrl);
		setPendingFile(file);
	}, []);

	const handleUpload = useCallback(async () => {
		if (!pendingFile || !preview) return;

		try {
			const result = await uploadImage({
				file: pendingFile,
				type: uploadType,
			}).unwrap();

			handleUploadBadgeSelect(result);
			setPreview(null);
			setPendingFile(null);
		} catch (err) {
			console.error('Upload failed:', err);
		}
	}, [
		pendingFile,
		preview,
		uploadImage,
		uploadType,
		handleUploadBadgeSelect,
	]);

	const handleDelete = useCallback(
		async (id) => {
			await deleteImage(id).unwrap();
		},
		[deleteImage]
	);

	return (
		<div className="disco-mt-4 disco-w-full disco-max-w-full disco-mx-auto">
			<ImagePreview
				images={uploadedImages}
				onDelete={handleDelete}
				handleUploadBadgeSelect={handleUploadBadgeSelect}
				isLoading={isLoadingImages}
				selectedDesign={selectedDesign}
			/>

			<div className="disco-p-4 disco-bg-white disco-border disco-border-primary disco-rounded-lg disco-shadow-md">
				<h2 className="disco-text-base disco-font-semibold disco-mb-2">
					{title}
				</h2>
				<ImageDropZone
					ref={fileInputRef}
					preview={preview}
					placeholderText={placeholderText}
					onFileSelect={handleFileSelect}
					onUpload={handleUpload}
					isUploading={isUploading}
				/>
			</div>
		</div>
	);
};

export default UploadBadgeComponent;
