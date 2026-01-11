// 12가지 문서 타입 정의
export type DocumentType =
  | 'prd'           // Product Requirements Document
  | 'trd'           // Technical Requirements Document
  | 'mvp'           // MVP 정의서
  | 'tdd'           // Technical Design Document
  | 'uix'           // UI/UX 설계서
  | 'api'           // API 명세서
  | 'database'      // 데이터베이스 스키마
  | 'architecture'  // 시스템 아키텍처
  | 'deployment'    // 배포 가이드
  | 'userManual'    // 사용자 매뉴얼
  | 'codingConvention' // 코딩 컨벤션
  | 'projectPlan';  // 프로젝트 일정표

export type Language = 'ko' | 'en';
export type ExportFormat = 'md' | 'docx';

export interface DocumentInfo {
  type: DocumentType;
  nameKo: string;
  nameEn: string;
  descriptionKo: string;
  descriptionEn: string;
  icon: string;
}

export const DOCUMENT_TYPES: DocumentInfo[] = [
  {
    type: 'prd',
    nameKo: 'PRD (제품 요구사항)',
    nameEn: 'PRD (Product Requirements)',
    descriptionKo: '제품의 목적, 목표, 기능 요구사항을 정의하는 문서',
    descriptionEn: 'Document defining product purpose, goals, and functional requirements',
    icon: '📋'
  },
  {
    type: 'trd',
    nameKo: 'TRD (기술 요구사항)',
    nameEn: 'TRD (Technical Requirements)',
    descriptionKo: '기술적 제약조건, 성능 요구사항, 보안 요구사항 정의',
    descriptionEn: 'Technical constraints, performance requirements, security requirements',
    icon: '⚙️'
  },
  {
    type: 'mvp',
    nameKo: 'MVP 정의서',
    nameEn: 'MVP Definition',
    descriptionKo: '최소 기능 제품의 범위와 핵심 기능 정의',
    descriptionEn: 'Minimum Viable Product scope and core features definition',
    icon: '🎯'
  },
  {
    type: 'tdd',
    nameKo: 'TDD (기술 설계)',
    nameEn: 'TDD (Technical Design)',
    descriptionKo: '시스템 설계, 컴포넌트 구조, 데이터 흐름 정의',
    descriptionEn: 'System design, component structure, data flow definition',
    icon: '🏗️'
  },
  {
    type: 'uix',
    nameKo: 'UI/UX 설계서',
    nameEn: 'UI/UX Design Spec',
    descriptionKo: '사용자 인터페이스 및 경험 설계 문서',
    descriptionEn: 'User interface and experience design specification',
    icon: '🎨'
  },
  {
    type: 'api',
    nameKo: 'API 명세서',
    nameEn: 'API Specification',
    descriptionKo: 'RESTful API 엔드포인트, 요청/응답 형식 정의',
    descriptionEn: 'RESTful API endpoints, request/response format definition',
    icon: '🔌'
  },
  {
    type: 'database',
    nameKo: '데이터베이스 스키마',
    nameEn: 'Database Schema',
    descriptionKo: '데이터베이스 테이블, 관계, 인덱스 설계',
    descriptionEn: 'Database tables, relationships, and index design',
    icon: '🗄️'
  },
  {
    type: 'architecture',
    nameKo: '시스템 아키텍처',
    nameEn: 'System Architecture',
    descriptionKo: '전체 시스템 구조 및 인프라 설계',
    descriptionEn: 'Overall system structure and infrastructure design',
    icon: '🏛️'
  },
  {
    type: 'deployment',
    nameKo: '배포 가이드',
    nameEn: 'Deployment Guide',
    descriptionKo: '배포 절차, 환경 설정, CI/CD 파이프라인',
    descriptionEn: 'Deployment procedures, environment setup, CI/CD pipeline',
    icon: '🚀'
  },
  {
    type: 'userManual',
    nameKo: '사용자 매뉴얼',
    nameEn: 'User Manual',
    descriptionKo: '최종 사용자를 위한 사용 가이드',
    descriptionEn: 'End-user guide and instructions',
    icon: '📖'
  },
  {
    type: 'codingConvention',
    nameKo: '코딩 컨벤션',
    nameEn: 'Coding Convention',
    descriptionKo: '코드 스타일, 네이밍 규칙, 베스트 프랙티스',
    descriptionEn: 'Code style, naming conventions, best practices',
    icon: '📝'
  },
  {
    type: 'projectPlan',
    nameKo: '프로젝트 일정표',
    nameEn: 'Project Plan',
    descriptionKo: '개발 일정, 마일스톤, 리소스 계획',
    descriptionEn: 'Development timeline, milestones, resource planning',
    icon: '📅'
  }
];

// 생성된 문서 인터페이스
export interface GeneratedDocument {
  type: DocumentType;
  language: Language;
  title: string;
  content: string;
  generatedAt: string;
}

// 프로젝트 입력 정보 (문서 생성용)
export interface ProjectInput {
  name: string;
  description: string;
  category: string;
  platform: string;
  targetUsers?: string;
  mainFeatures?: string[];
  techPreferences?: string;
}
