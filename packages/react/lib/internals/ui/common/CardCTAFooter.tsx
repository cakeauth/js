const CardCTAFooter = ({
  href,
  label,
  cta,
}: {
  href: string;
  label: string;
  cta: string;
}) => {
  return (
    <div className="bg-muted py-4 border-t-0 shadow items-center justify-center border">
      <p className="text-center text-muted-foreground small">
        {label}{" "}
        <a href={href} className="hover:underline">
          <span className="text-primary font-medium">{cta}</span>
        </a>
      </p>
    </div>
  );
};

export default CardCTAFooter;
