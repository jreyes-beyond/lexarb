import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentViewer } from '@/components/documents/DocumentViewer';

describe('DocumentViewer', () => {
  const defaultProps = {
    url: 'http://example.com/document.pdf',
    title: 'Test Document',
  };

  it('renders the document viewer with title', () => {
    render(<DocumentViewer {...defaultProps} />);
    expect(screen.getByText('Test Document')).toBeInTheDocument();
  });

  it('renders zoom controls', () => {
    render(<DocumentViewer {...defaultProps} />);
    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
  });

  it('handles fullscreen toggle', () => {
    const onToggleFullscreen = jest.fn();
    render(
      <DocumentViewer
        {...defaultProps}
        isFullscreen={false}
        onToggleFullscreen={onToggleFullscreen}
      />
    );

    fireEvent.click(screen.getByLabelText('Enter fullscreen'));
    expect(onToggleFullscreen).toHaveBeenCalled();
  });

  it('opens download in new tab', () => {
    const windowOpenSpy = jest.spyOn(window, 'open');
    render(<DocumentViewer {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Download'));
    expect(windowOpenSpy).toHaveBeenCalledWith(
      defaultProps.url,
      '_blank'
    );
  });
});
