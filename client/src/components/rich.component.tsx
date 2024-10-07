export const RichComponent = ({ content }: { content: string }) => (
  <div id="id-rich-content" dangerouslySetInnerHTML={{ __html: content }} className="ion-label" />
);
