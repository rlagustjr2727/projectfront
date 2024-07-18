export const MAIN_PATH = () => '/';

export const LOGIN_PATH = () => '/login';
export const REGISTER_PATH = () => '/register';

export const MYPAGE_PATH = () => '/mypage';

export const BOARD_PATH = () => '/board';   // 보드 기본
export const BOARD_CATEGORY_PATH = (category) => `/board/${category}`;   // 보드 기본
export const BOARD_DETAIL_PATH = (seq) => `/board/detail/${seq}`; // 보드 상세
export const BOARD_WRITE_PATH = () => '/board/write';   // 보드 글 작성
export const BOARD_UPDATE_PATH = (boardSeq) => `/board/update/${boardSeq}`; // 보드 수정

export const WBOARD_PATH = () => '/wboard'; // 위스키 보드

export const SEARCH_PATH = (keyword) => `/search/${keyword}`; // 검색

export const NOTICE_PATH = () => '/notice'; // 공지사항
export const NOTICE_DETAIL_PATH = (seq) => `/notice/detail/${seq}` // 공지사항 상세
export const NOTICE_CREATE_PATH = () => 'notice/write' // 공지사항 작성
export const NEWS_PATH = () => '/whisky/events' // 위스키 관련 뉴스