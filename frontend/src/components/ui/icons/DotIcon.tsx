interface DotIconProps {
  className?: string
}

/**
 * Dot AI Assistant icon - the Medidata AI branding icon.
 * Features a sparkle/star and a circle representing the AI assistant.
 */
export function DotIcon({ className }: DotIconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.9541 0.800194C31.2928 -0.26673 32.8071 -0.266732 33.1458 0.800192L34.4952 5.05063C34.6081 5.40625 34.8875 5.68484 35.2442 5.7974L39.1974 7.14271C40.2675 7.4804 40.2675 8.99019 39.1974 9.32788L35.2442 10.6732C34.8875 10.7857 34.6081 11.0643 34.4952 11.42L33.1458 15.6704C32.8071 16.7373 31.2928 16.7373 30.9541 15.6704L29.6047 11.42C29.4918 11.0643 29.2124 10.7857 28.8557 10.6732L24.5924 9.32788C23.5223 8.99019 23.5223 7.4804 24.5924 7.14271L28.8557 5.7974C29.2124 5.68484 29.4918 5.40625 29.6047 5.05063L30.9541 0.800194ZM14.1602 40C21.9807 40 28.3204 33.6793 28.3204 25.8824C28.3204 18.0854 21.9807 11.7647 14.1602 11.7647C6.33974 11.7647 0 18.0854 0 25.8824C0 33.6793 6.33974 40 14.1602 40Z"
        fill="currentColor"
      />
    </svg>
  )
}
