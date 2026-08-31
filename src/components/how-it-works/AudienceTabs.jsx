function AudienceTabs({ activeTab, onChange }) {
  const tabs = [
    {
      id: 'compradores',
      label: 'Compradores',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M4 6v-2h16v2H4Zm0 14v-6h-1v-2l1 -5h16l1 5v2h-1v6h-2v-6H14v6H4Zm2 -2h6v-4H6v4Zm-0.95 -6h13.9 -13.9Zm0 0h13.9l-0.6 -3H5.65l-0.6 3Z" />
        </svg>
      ),
    },

    {
      id: 'fornecedores',
      label: 'Fornecedores',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M11 19.425v-6.85L5 9.1v6.85l6 3.475Zm2 0 6 -3.475v-6.85L13 12.575v6.85Zm-2 2.3L4 17.7q-0.475 -0.275 -0.7375 -0.725T3 15.975v-7.95q0 -0.55 0.2625 -1t0.7375 -0.725l7 -4.025q0.475 -0.275 1 -0.275t1 0.275l7 4.025q0.475 0.275 0.7375 0.725t0.2625 1v7.95q0 0.55 -0.2625 1T20 17.7L13 21.725q-0.475 0.275 -1 0.275t-1 -0.275Zm5 -13.2 1.925 -1.1 -5.925 -3.425 -1.95 1.125 5.95 3.4Zm-4 2.325 1.95 -1.125 -5.925 -3.425 -1.95 1.125 5.925 3.425Z" />
        </svg>
      ),
    },

    {
      id: 'ongs',
      label: 'ONGs',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M16 13 11.85 8.95q-0.775 -0.75 -1.3125 -1.6625T10 5.3q0 -1.375 0.9625 -2.3375T13.3 2q0.8 0 1.5 0.3375t1.2 0.9125q0.5 -0.575 1.2 -0.9125t1.5 -0.3375q1.375 0 2.3375 0.9625T22 5.3q0 1.075 -0.525 1.9875T20.175 8.95L16 13Zm0 -2.8 2.725 -2.675q0.475 -0.475 0.875 -1.0125t.4 -1.2125q0 -0.55 -.375 -.925t-.925 -.375q-.35 0 -.6625 .1375T17.5 4.55l-1.5 1.8 -1.5 -1.8q-.225 -.275 -.5375 -.4125T13.3 4q-.55 0 -.925 .375t-.375 .925q0 .675 .4 1.2125t.875 1.0125l2.725 2.675ZM7 18.5l6.95 1.9 5.95 -1.85q-.125 -.225 -.3625 -.3875T19 18H13.95q-.675 0 -1.075 -.05t-.825 -.2l-2.325 -.775 .55 -1.95 2.025 .675q.425 .125 1 .2t1.7 .1q0 -.275 -.1625 -.525T14.45 15.15l-5.85 -2.15h-1.6v5.5ZM1 22v-11h7.6q.175 0 .35 .0375t.325 .0875l5.875 2.175q.825 .3 1.3375 1.05t.5125 1.65h2q1.25 0 2.125 .825t.875 2.175v1L14 22.5l-7 -1.95v1.45H1Zm2 -2h2v-7h-2v7Zm13 -13.65Z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="tab-switcher-band">
      <div className="tab-switcher">

        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-button ${
              activeTab === tab.id ? 'tab-button-active' : ''
            }`}
            onClick={() => onChange(tab.id)}
          >
            <span className="icon icon-28" aria-hidden="true">
              {tab.icon}
            </span>

            {tab.label}
          </button>
        ))}

      </div>
    </div>
  )
}

export default AudienceTabs