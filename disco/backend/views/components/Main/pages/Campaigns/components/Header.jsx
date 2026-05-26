import {
	ArrowDownTrayIcon,
	Cog6ToothIcon,
	Square3Stack3DIcon,
} from '@heroicons/react/16/solid';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import VersionCompareNotice from '../../../components/VersionCompareNotice';
import { useAddCampaignMutation } from '../../../features/campaigns/campaignsApi';
import { reset } from '../../../features/discount/discountSlice';
import { prepareCampaignForRequest } from '../../../utilities/utilities';

const Header = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [
		addCampaign,
		{ isLoading: importing, isError: importFailed, isSuccess: imported },
	] = useAddCampaignMutation();

	const handleJSONUpload = (e) => {
		const file = e.target.files[0];

		if (file) {
			const fileName = file.name;
			const fileExtension = fileName.split('.').pop().toLowerCase();
			if (fileExtension !== 'disco') {
				toast.error(__('Please Select Valid File', 'disco'));
				return;
			}

			const reader = new FileReader();
			reader.onload = function async(event) {
				try {
					const fileContent = event.target.result;
					const campaignData = JSON.parse(fileContent);
					const dataForRequest = prepareCampaignForRequest(
						campaignData,
						'Imported'
					);
					addCampaign(dataForRequest);
					e.target.value = '';
				} catch (error) {
					toast.error(
						__('Please Try Again with Valid File', 'disco')
					);
				}
			};

			reader.readAsText(file);
		}
	};

	const handleNewCampaign = () => {
		navigate('disco');
		dispatch(reset());
	};

	const handleNavigateToSettings = () => {
		navigate('settings');
	};

	useEffect(() => {
		if (importFailed) {
			toast.error(__('Disco File Is Not Valid', 'disco'));
		}
	}, [importFailed]);

	useEffect(() => {
		if (imported) {
			toast.success(__('Discount Successfully Imported', 'disco'));
		}
	}, [imported]);

	return (
		<>
			<VersionCompareNotice />
			<div className="disco-flex disco-items-center disco-justify-between">
				<div className="disco-flex disco-items-center disco-gap-3">
					<h2 className="disco-text-2xl disco-font-regular">
						{__('Discount Campaigns', 'disco')}
					</h2>
				</div>
				<div className="disco-flex disco-gap-4">
					<Button
						onClick={handleNewCampaign}
						className="!disco-px-4 !disco-py-2.5 disco-text-sm"
						icon={
							<Square3Stack3DIcon className="disco-h-4 disco-w-4" />
						}
					>
						{__('Create a Discount', 'disco')}
					</Button>

					<div className="disco-flex disco-border !disco-rounded-lg disco-shadow-custom !disco-border-primary disco-gap-2 disco-items-center">
						<input
							placeholder={__('Select Disco File', 'disco')}
							onChange={handleJSONUpload}
							id="disco_import_discount_json"
							type="file"
							accept=".disco"
							className="disco-hidden"
						/>
						<label
							className="disco-bg-transparent disco-flex disco-items-center disco-gap-2 disco-font-medium disco-text-sm disco-px-2.5 disco-ps-2 disco-py-2.5"
							htmlFor="disco_import_discount_json"
						>
							<ArrowDownTrayIcon className="disco-h-4 disco-w-4 disco-text-primary" />
							{importing
								? __('Importing', 'disco')
								: __('Import', 'disco')}
						</label>
						{importing && <LoadingSpinner size={4} />}
					</div>

					<Button
						onClick={handleNavigateToSettings}
						type="transparent"
						className="!disco-px-2.5 !disco-py-2 disco-text-sm"
						icon={
							<Cog6ToothIcon className="disco-h-4 disco-w-4 disco-text-primary" />
						}
					>
						{__('Settings', 'disco')}
					</Button>
				</div>
			</div>
		</>
	);
};
export default Header;
