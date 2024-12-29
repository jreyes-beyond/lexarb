import { render, screen, fireEvent } from '@testing-library/react';
import { AnalysisPanel } from '@/components/documents/AnalysisPanel';

describe('AnalysisPanel', () => {
  const mockAnalysis = {
    classification: 'Legal Contract',
    summary: 'Test summary content',
    key_information: {
      parties: ['Party A', 'Party B'],
      date: '2024-01-01',
    },
    citations: ['Citation 1', 'Citation 2'],
    metadata: {
      fileName: 'test.pdf',
      fileSize: '1.2MB',
    },
  };

  it('renders analysis classification', () => {
    render(<AnalysisPanel analysis={mockAnalysis} />);
    expect(screen.getByText('Legal Contract')).toBeInTheDocument();
  });

  it('displays summary content', () => {
    render(<AnalysisPanel analysis={mockAnalysis} />);
    expect(screen.getByText('Test summary content')).toBeInTheDocument();
  });

  it('switches between tabs', () => {
    render(<AnalysisPanel analysis={mockAnalysis} />);

    // Click Citations tab
    fireEvent.click(screen.getByText('Citations'));
    expect(screen.getByText('Citation 1')).toBeInTheDocument();

    // Click Key Information tab
    fireEvent.click(screen.getByText('Key Information'));
    expect(screen.getByText('parties')).toBeInTheDocument();
    expect(screen.getAllByText(/Party [AB]/).length).toBe(2);
  });

  it('displays metadata information', () => {
    render(<AnalysisPanel analysis={mockAnalysis} />);

    // Click Metadata tab
    fireEvent.click(screen.getByText('Metadata'));
    expect(screen.getByText('fileName')).toBeInTheDocument();
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('1.2MB')).toBeInTheDocument();
  });
});
