import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(22, 28, 45, 0.95);
  font-family: 'Space Grotesk', sans-serif;
  color: ${({ theme }) => theme.colors.text};
  padding: 20px;
  box-sizing: border-box;
  gap: 16px;
`;

const FileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 12px;
`;

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;

  textarea {
    flex-grow: 1;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 12px;
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9rem;
    resize: none;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary}50;
    }
  }
`;

export default function NotesApp() {
  return (
    <Container>
      <FileHeader>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#01cdfe' }}>
          <i className="fas fa-file-alt" style={{ marginRight: '6px' }} />
          workspace_scratchpad.txt
        </span>
        <span style={{ fontSize: '0.75rem', color: '#888' }}>UTF-8</span>
      </FileHeader>

      <EditorWrapper>
        <textarea 
          placeholder="Start writing notes here... (Synced locally in Phase 2)"
          defaultValue="CONFIDENTIAL MEMO: Phase 1 windowing infrastructure is now operational. Next step: add localStorage persistence layer for workspace drafts."
        />
      </EditorWrapper>
    </Container>
  );
}
