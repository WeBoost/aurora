import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WebsiteSectionManager } from '@/components/WebsiteSectionManager';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';

jest.mock('@/hooks/useWebsiteContent');

describe('WebsiteSectionManager', () => {
  const mockSections = [
    {
      id: '1',
      type: 'hero',
      content: {
        heading: 'Test Hero',
      },
      order: 0,
    },
    {
      id: '2',
      type: 'features',
      content: {
        title: 'Test Features',
      },
      order: 1,
    },
  ];

  const mockReorderSections = jest.fn();
  const mockRemoveSection = jest.fn();

  beforeEach(() => {
    (useWebsiteContent as jest.Mock).mockReturnValue({
      sections: mockSections,
      reorderSections: mockReorderSections,
      removeSection: mockRemoveSection,
    });
  });

  it('renders all sections', () => {
    const { getByText } = render(
      <WebsiteSectionManager businessId="test-id" />
    );

    expect(getByText('Hero Section')).toBeTruthy();
    expect(getByText('Features Section')).toBeTruthy();
  });

  it('handles section deletion', () => {
    const { getAllByRole } = render(
      <WebsiteSectionManager businessId="test-id" />
    );

    const deleteButtons = getAllByRole('button').filter(
      button => button.props.accessibilityLabel === 'Delete section'
    );

    fireEvent.press(deleteButtons[0]);
    expect(mockRemoveSection).toHaveBeenCalledWith('1');
  });

  it('handles section reordering', () => {
    const { getAllByRole } = render(
      <WebsiteSectionManager businessId="test-id" />
    );

    const dragHandles = getAllByRole('button').filter(
      button => button.props.accessibilityLabel === 'Drag to reorder'
    );

    // Simulate drag and drop
    fireEvent(dragHandles[0], 'onDragStart');
    fireEvent(dragHandles[1], 'onDrop');

    expect(mockReorderSections).toHaveBeenCalledWith([
      { ...mockSections[1], order: 0 },
      { ...mockSections[0], order: 1 },
    ]);
  });
});