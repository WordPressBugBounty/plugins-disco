import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { __ } from '@wordpress/i18n';
import { forwardRef, useState } from 'react';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_SIZE = 100 * 1024; // 100 KB

const validateFile = (file) => {
	if (!ALLOWED_TYPES.includes(file.type)) {
		return 'Only PNG, JPG, JPEG, and WebP formats are allowed.';
	}
	if (file.size > MAX_SIZE) {
		return 'File size must be under 100 KB.';
	}
	return null;
};

const ImageDropZone = forwardRef(
	(
		{
			preview,
			placeholderText = 'Drag or drop your image',
			onFileSelect,
			onUpload,
			isUploading = false,
		},
		ref
	) => {
		const [error, setError] = useState(null);

		const handleFile = (file) => {
			if (!file) return;
			const err = validateFile(file);
			if (err) {
				setError(err);
				return;
			}
			setError(null);
			onFileSelect(file);
		};

		const handleDragOver = (e) => {
			e.preventDefault();
		};

		const handleDrop = (e) => {
			e.preventDefault();
			handleFile(e.dataTransfer.files[0]);
		};

		const handleChange = (e) => {
			handleFile(e.target.files[0]);
			e.target.value = '';
		};

		return (
			<div>
				<div
					className="disco-relative disco-flex disco-flex-col disco-items-center disco-justify-center disco-h-48 disco-border disco-border-dashed disco-border-gray-300 disco-rounded-lg disco-bg-gray-50 disco-cursor-pointer"
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					{preview ? (
						<img
							src={preview}
							alt="Selected"
							className="disco-h-full disco-w-full disco-object-contain disco-rounded-lg"
						/>
					) : (
						<div className="disco-flex disco-flex-col disco-items-center disco-text-gray-500">
							<PlusCircleIcon className="disco-w-8 disco-h-8 disco-text-green-500" />
							<p className="disco-mt-2 disco-text-sm">
								{placeholderText}
							</p>
							<p className="disco-text-xs disco-text-gray-400 disco-mt-1">
								{__(
									'Supported formats: PNG, JPG, JPEG, WebP (max 100 KB)',
									'disco'
								)}
							</p>
						</div>
					)}
					<input
						ref={ref}
						type="file"
						accept=".png,.jpg,.jpeg,.webp"
						onChange={handleChange}
						className="disco-absolute disco-inset-0 disco-opacity-0 disco-cursor-pointer"
					/>
				</div>
				{error && (
					<p className="disco-text-red-500 disco-text-xs disco-mt-1">
						{error}
					</p>
				)}
				{preview && (
					<button
						onClick={onUpload}
						disabled={isUploading}
						className="disco-w-full disco-mt-2 disco-py-1.5 disco-bg-primary disco-text-white disco-rounded-md disco-text-sm disco-font-semibold disco-cursor-pointer hover:disco-opacity-90 disabled:disco-opacity-50 disabled:disco-cursor-not-allowed"
					>
						{isUploading
							? __('Uploading...', 'disco')
							: __('Upload Now', 'disco')}
					</button>
				)}
			</div>
		);
	}
);

ImageDropZone.displayName = 'ImageDropZone';

export default ImageDropZone;
