export const RichComponent = ({ content }: { content: string }) => (
  <div dangerouslySetInnerHTML={{ __html: content }} className="ion-label" />
);
