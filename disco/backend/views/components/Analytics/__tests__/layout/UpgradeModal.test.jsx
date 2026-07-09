import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import UpgradeModal from '../../components/layout/UpgradeModal';

describe('UpgradeModal', () => {
	it('renders the PRO badge', () => {
		render(<UpgradeModal />);
		expect(screen.getByText('PRO')).toBeInTheDocument();
	});

	it('renders the Disco Plugin label', () => {
		render(<UpgradeModal />);
		expect(screen.getByText('Disco Plugin')).toBeInTheDocument();
	});

	it('renders Disco Pro Analytics heading', () => {
		render(<UpgradeModal />);
		expect(screen.getByText('Disco Pro Analytics')).toBeInTheDocument();
	});

	it('renders the upgrade subtitle', () => {
		render(<UpgradeModal />);
		expect(
			screen.getByText('Upgrade to unlock advanced analytics & insights.')
		).toBeInTheDocument();
	});

	it('renders all feature items', () => {
		render(<UpgradeModal />);

		const features = [
			'Real revenue per campaign - no guessing',
			'Which products sell more when discounts run',
			'Your highest-value customers, identified',
			'Discount given vs revenue earned, tracked',
			'Spot losing campaigns before they cost you',
		];

		features.forEach((feature) => {
			expect(screen.getByText(feature)).toBeInTheDocument();
		});
	});

	it('renders Upgrade to Pro button', () => {
		render(<UpgradeModal />);
		expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument();
	});

	it('renders money-back guarantee text', () => {
		render(<UpgradeModal />);
		expect(
			screen.getByText('14-day money-back guarantee')
		).toBeInTheDocument();
	});

	it('renders View pricing link', () => {
		render(<UpgradeModal />);
		const link = screen.getByText('View pricing →');
		expect(link).toBeInTheDocument();
		expect(link.closest('a')).toHaveAttribute(
			'href',
			'https://discoplugin.com/#pricing'
		);
	});

	it('opens pricing page when Upgrade to Pro is clicked', () => {
		const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
		render(<UpgradeModal />);

		screen.getByText('Upgrade to Pro').click();
		expect(openSpy).toHaveBeenCalledWith(
			'https://discoplugin.com/#pricing',
			'_blank'
		);

		openSpy.mockRestore();
	});
});
