import { GeneratedDocument, DocumentType, Language, ProjectInput, DOCUMENT_TYPES } from '@/types/documents';
import { generateDocument, generateAllDocuments } from './documentGenerator';

// Markdown 파일로 내보내기
export function exportToMarkdown(doc: GeneratedDocument): string {
  return doc.content;
}

// 모든 문서를 Markdown으로 내보내기
export function exportAllToMarkdown(
  project: ProjectInput,
  lang: Language
): { filename: string; content: string }[] {
  const docs = generateAllDocuments(lang, project);
  const langSuffix = lang === 'ko' ? '_KO' : '_EN';

  return docs.map(doc => ({
    filename: `${doc.type.toUpperCase()}${langSuffix}.md`,
    content: doc.content
  }));
}

// DOCX 생성을 위한 헬퍼
export async function exportToDocx(doc: GeneratedDocument): Promise<Blob> {
  const {
    Document,
    Paragraph,
    TextRun,
    HeadingLevel,
    Packer,
  } = await import('docx');

  // Markdown을 DOCX 구조로 변환
  const lines = doc.content.split('\n');
  const children: any[] = [];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      children.push(new Paragraph({
        text: line.replace('# ', ''),
        heading: HeadingLevel.TITLE,
      }));
    } else if (line.startsWith('## ')) {
      children.push(new Paragraph({
        text: line.replace('## ', ''),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }));
    } else if (line.startsWith('### ')) {
      children.push(new Paragraph({
        text: line.replace('### ', ''),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
      }));
    } else if (line.startsWith('- ')) {
      children.push(new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun(line.replace('- ', ''))],
      }));
    } else if (line.match(/^\d+\. /)) {
      children.push(new Paragraph({
        children: [new TextRun(line)],
      }));
    } else if (line.startsWith('|')) {
      // 테이블은 일반 텍스트로
      children.push(new Paragraph({
        children: [new TextRun({ text: line, font: 'Courier New', size: 20 })],
      }));
    } else if (line.startsWith('```')) {
      // 코드 블록 시작/끝 무시
    } else if (line.trim()) {
      children.push(new Paragraph({
        children: [new TextRun(line)],
      }));
    } else {
      children.push(new Paragraph({ text: '' }));
    }
  }

  const document = new Document({
    sections: [{
      properties: {},
      children,
    }],
  });

  return await Packer.toBlob(document);
}

// 모든 문서를 DOCX로 내보내기
export async function exportAllToDocx(
  project: ProjectInput,
  lang: Language
): Promise<{ filename: string; blob: Blob }[]> {
  const docs = generateAllDocuments(lang, project);
  const langSuffix = lang === 'ko' ? '_KO' : '_EN';

  const results: { filename: string; blob: Blob }[] = [];

  for (const doc of docs) {
    const blob = await exportToDocx(doc);
    results.push({
      filename: `${doc.type.toUpperCase()}${langSuffix}.docx`,
      blob
    });
  }

  return results;
}

// 문서 다운로드 (브라우저용)
export function downloadFile(filename: string, content: string | Blob) {
  let blob: Blob;

  if (typeof content === 'string') {
    blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  } else if (content instanceof Blob) {
    // ZIP 파일인 경우 MIME 타입 확인 및 재설정
    if (filename.endsWith('.zip') && content.type !== 'application/zip') {
      blob = new Blob([content], { type: 'application/zip' });
    } else {
      blob = content;
    }
  } else {
    blob = new Blob([content], { type: 'application/octet-stream' });
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ZIP으로 모든 문서 내보내기 (JSZip 필요)
export async function exportAllAsZip(
  project: ProjectInput,
  includeKo: boolean = true,
  includeEn: boolean = true
): Promise<Blob> {
  // JSZip 동적 import
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  const projectFolder = project.name.replace(/\s+/g, '_');

  if (includeKo) {
    const koFolder = zip.folder(`${projectFolder}/한글`);
    const koDocs = generateAllDocuments('ko', project);

    for (const doc of koDocs) {
      // MD 파일
      koFolder?.file(`${doc.type.toUpperCase()}_KO.md`, doc.content);

      // DOCX 파일
      const docxBlob = await exportToDocx(doc);
      koFolder?.file(`${doc.type.toUpperCase()}_KO.docx`, docxBlob);
    }
  }

  if (includeEn) {
    const enFolder = zip.folder(`${projectFolder}/English`);
    const enDocs = generateAllDocuments('en', project);

    for (const doc of enDocs) {
      // MD 파일
      enFolder?.file(`${doc.type.toUpperCase()}_EN.md`, doc.content);

      // DOCX 파일
      const docxBlob = await exportToDocx(doc);
      enFolder?.file(`${doc.type.toUpperCase()}_EN.docx`, docxBlob);
    }
  }

  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip'
  });
}

// 문서 타입 정보 가져오기
export function getDocumentInfo(type: DocumentType) {
  return DOCUMENT_TYPES.find(d => d.type === type);
}

// 모든 문서 타입 목록
export function getAllDocumentTypes() {
  return DOCUMENT_TYPES;
}
