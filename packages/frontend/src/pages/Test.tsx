import React from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '../layout/DefaultLayout';

const Test: React.FC = () => {
    const { t } = useTranslation(); // Hook to access translation functions
    
    return (
        <DefaultLayout>
            <div>
                <h1>{t('HELLO')}</h1> {/* Use the t() function to translate the text */}
            </div>
        </DefaultLayout>
    );
};

export default Test;