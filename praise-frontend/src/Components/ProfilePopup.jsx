import React from 'react';

// --- ICON COMPONENTS (Unchanged) ---
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.535 0 4.908.647 7.042 1.804M12 13a4 4 0 100-8 4 4 0 000 8z"/>
  </svg>
);
// NOTE: ChevronIcon is kept here but removed from the final JSX output below.
const ChevronIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-3m3-12h3a3 3 0 013 3v1"/>
  </svg>
);

// --- MENU ITEM COMPONENT (Unchanged - Note: Padding is set here to `px-4 py-3`) ---
const MenuItem = ({ icon, label, onClick, isToggle = false, toggleState = false }) => (
    <div
      className={`
        flex items-center justify-between px-4 py-3 cursor-pointer 
        text-white transition-colors duration-150 hover:bg-[#2e2e2e]
      `}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {icon}
        <span className="font-normal text-[15px]">{label}</span>
      </div>
      {isToggle && (
        <div 
          className={`
            w-10 h-6 flex items-center p-1 rounded-full transition-colors duration-300
            ${toggleState ? 'bg-[#43b96f]' : 'bg-gray-600'}
          `}
        >
          <div 
            className={`
              bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
              ${toggleState ? 'translate-x-4' : 'translate-x-0'}
            `}
          />
        </div>
      )}
    </div>
  );

// --- PROFILE POPUP COMPONENT (Modified) ---
const ProfilePopup = ({
  userName = "Nimit",
  onClose,
  onLogout = () => {},
  popupRef 
}) => {
  return (
    <div
      ref={popupRef}
      className={`
        absolute bottom-full left-0 mb-3 
        w-full 
        px-2 // ADDED: Horizontal padding for spacing from the sidebar edges
        bg-transparent // Set main container to transparent to show padding
        z-50 
        transform origin-bottom 
        transition-all duration-300 ease-out 
        opacity-100 scale-100 
      `}
    >
      {/* INNER POPUP CONTAINER - Background, border, shadow, and rounded corners applied here */}
      <div className="bg-[#1a1a1a] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden">
        
        {/* MENU ITEMS (Log out) */}
        <nav className="py-1"> {/* Adjusted vertical padding for similar size */}
          <MenuItem icon={<LogOutIcon />} label="Log out" onClick={() => { onLogout(); onClose(); }} />
        </nav>
        
        {/* Footer Section (Your Name) - CHEVRON REMOVED */}
        <div 
          className="flex items-center justify-between p-3 bg-[#222222] border-t border-white/10"
          style={{ padding: '12px 16px' }} // Custom padding to match MenuItem's `py-3` (12px) and `px-4` (16px) for similar height
        >
          <div className="flex items-center gap-4 text-white">
            <ProfileIcon />
            <span className="font-semibold text-lg">{userName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;