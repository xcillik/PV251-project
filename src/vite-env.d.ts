/// <reference types="vite/client" />

 interface ImportMetaEnv {
    VITE_PUBLC_URL: string;

    VITE_HOST: string;

    VITE_TITLE: string;
    VITE_SUBTITLE: string;
    VITE_DESCRIPTION: string;
    VITE_KEYWORDS: string;
    VITE_ABSTRACT: string;
    VITE_AUTHOR: string;
    VITE_COPYRIGHT: string;
    VITE_CONTACT_MAIL: string;
    
    VITE_FOOTER_YEAR: string;
 }

 interface ImportMeta {
    env: ImportMetaEnv;
 }
