import React from 'react';
import schoolLogoSvg from '../assets/school-logo.svg';

interface SchoolLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const imgSizeClass =
    size === 'xs'
      ? 'w-10 h-10'
      : size === 'sm'
      ? 'w-14 h-14'
      : size === 'md'
      ? 'w-24 h-24'
      : size === 'lg'
      ? 'w-36 h-36 sm:w-44 sm:h-44'
      : size === 'xl'
      ? 'w-48 h-48 sm:w-56 sm:h-56'
      : 'w-60 h-60 sm:w-72 sm:h-72';

  return (
    <div className={`flex flex-col items-center justify-center shrink-0 ${className}`}>
      <img
        src={schoolLogoSvg}
        alt="شعار مدرسة المطوعة شريفة العمر"
        className={`${imgSizeClass} object-contain drop-shadow-xs select-none`}
        loading="eager"
      />

      {showText && (
        <div className="text-center mt-2">
          <p className="text-xs font-bold text-[#17436A]/80">وزارة التربية • منطقة الجهراء</p>
          <p className="text-sm font-black text-[#17436A]">المطوعة شريفة العمر – المتوسطة بنات</p>
        </div>
      )}
    </div>
  );
};
