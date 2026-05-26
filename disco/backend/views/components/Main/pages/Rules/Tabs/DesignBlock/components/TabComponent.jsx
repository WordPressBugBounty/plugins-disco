const TabComponent = ({ tabs, activeTab, onTabChange }) => {
	return (
		<div className="disco-w-full disco-mx-auto disco-mt-4 disco-bg-white disco-border disco-border-primary disco-rounded-lg">
			{/* Tabs */}
			<div className="disco-flex">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						className={`disco-w-1/2 disco-py-3 disco-rounded-t-lg disco-font-semibold ${
							activeTab === tab.id
								? 'disco-bg-gray-100 disco-text-primary'
								: 'disco-bg-gray-50 disco-text-gray-500'
						}`}
						onClick={() => onTabChange(tab.id)}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Tab Content */}
			<div className="disco-p-2 ">
				{tabs.map((tab) =>
					activeTab === tab.id ? (
						<div key={tab.id} className="disco-content">
							{tab.content}
						</div>
					) : null
				)}
			</div>
		</div>
	);
};

export default TabComponent;
