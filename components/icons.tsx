
import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {children}
    </svg>
);

export const UploadIcon: React.FC = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </IconWrapper>
);

export const ClearIcon: React.FC = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </IconWrapper>
);

export const DownloadIcon: React.FC = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </IconWrapper>
);

export const ShareIcon: React.FC = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </IconWrapper>
);

export const RedoIcon: React.FC = () => (
     <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 12A8 8 0 1013 5.3l-3 3" />
    </IconWrapper>
);

export const StartOverIcon: React.FC = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </IconWrapper>
);
