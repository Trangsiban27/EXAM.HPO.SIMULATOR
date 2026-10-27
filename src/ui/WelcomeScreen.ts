import './welcome-screen.css';

export type WelcomeClassOption = 'b-auto' | 'b-manual' | 'c1';

export interface WelcomeScreenOptions {
    onStart?: (selectedClass: WelcomeClassOption) => void;
    onBeginLesson?: () => void;
}

export class WelcomeScreen {
    private root: HTMLDivElement;
    private guideModal: HTMLDivElement;
    private guideReturnFocus?: HTMLElement;
    private selectedClass: WelcomeClassOption = 'b-manual';
    private onStartCallback?: (selectedClass: WelcomeClassOption) => void;
    private onBeginLessonCallback?: () => void;
    private guideOpenedFromStart = false;
    private toastTimer = 0;

    constructor(container: HTMLElement, options: WelcomeScreenOptions = {}) {
        this.onStartCallback = options.onStart;
        this.onBeginLessonCallback = options.onBeginLesson;
        this.root = document.createElement('div');
        this.root.className = 'welcome-overlay';
        this.root.id = 'welcomeOverlay';
        this.root.innerHTML = this.renderHTML();
        this.guideModal = this.root.querySelector<HTMLDivElement>('#guideModalBackdrop')!;
        container.appendChild(this.root);

        this.bindEvents();
        // The guide is also accessible while the welcome screen is hidden.
        container.appendChild(this.guideModal);
    }

    private renderHTML(): string {
        return `
            <div class="welcome-backdrop"></div>
            
            <div class="welcome-container">
                <!-- Top Navigation Bar -->
                <header class="welcome-topbar">
                    <div class="welcome-logo">
                        <img src="/banner/Tách nền màu gốc-01.png" alt="HPO Logo" class="welcome-logo-badge" />
                        <div class="welcome-logo-text">
                            <span class="welcome-logo-title">HPO</span>
                            <span class="welcome-logo-sub">ĐÀO TẠO LÁI XE</span>
                        </div>
                    </div>

                    <button class="welcome-guide-btn" id="welcomeGuideBtn" type="button" aria-label="Xem hướng dẫn sử dụng">
                        <svg class="icon-book" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        <span>Hướng dẫn sử dụng</span>
                    </button>
                </header>

                <!-- Center Hero Section -->
                <div class="welcome-hero">
                    <div class="welcome-tag">
                        <span>MÔ PHỎNG SÁT HẠCH LÁI XE TRONG HÌNH</span>
                    </div>
                    <h1 class="welcome-title">
                        <span class="title-line1">CHÀO MỪNG BẠN ĐẾN VỚI</span>
                        <span class="title-line2">BÀI HỌC SA HÌNH</span>
                    </h1>
                    <p class="welcome-desc">
                        Lựa chọn hạng bằng lái để bắt đầu luyện tập với mô phỏng 3D sát với kỳ sát hạch thực tế.
                    </p>
                </div>

                <!-- 3 Class Option Cards -->
                <div class="welcome-cards">
                    <!-- Option 1: HẠNG B - SỐ TỰ ĐỘNG -->
                    <div class="welcome-card disabled" data-class="b-auto">
                        <div class="card-header">
                            <div class="card-title-group">
                                <h2 class="card-class-name">HẠNG B</h2>
                                <span class="card-pill pill-yellow">SỐ TỰ ĐỘNG</span>
                                <span class="card-pill pill-blue">Sắp ra mắt</span>
                            </div>
                            <div class="card-lock">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                        </div>

                        <div class="card-img-wrap">
                            <img src="/banner/vios_cutout.png" alt="Toyota Vios Số Tự Động" class="card-img" />
                        </div>

                        <div class="card-footer">
                            <div class="footer-icon">
                                <svg viewBox="0 0 28 28" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                                    <circle cx="8" cy="8" r="3.5"></circle>
                                    <path d="M8 11.5v12"></path>
                                    <circle cx="16" cy="7" r="1.4" fill="currentColor"></circle>
                                    <circle cx="16" cy="12" r="1.4" fill="currentColor"></circle>
                                    <circle cx="16" cy="17" r="1.4" fill="currentColor"></circle>
                                    <circle cx="16" cy="22" r="1.4" fill="currentColor"></circle>
                                    <circle cx="21" cy="17" r="1.4" fill="currentColor"></circle>
                                    <circle cx="21" cy="22" r="1.4" fill="currentColor"></circle>
                                </svg>
                            </div>
                            <div class="footer-info">
                                <div class="footer-title">Hộp số tự động</div>
                                <div class="footer-subtitle">Đang cập nhật. Vui lòng quay lại sau!</div>
                            </div>
                        </div>
                    </div>

                    <!-- Option 2: HẠNG B - SỐ SÀN -->
                    <div class="welcome-card selected" data-class="b-manual">
                        <div class="card-header">
                            <div class="card-title-group">
                                <h2 class="card-class-name">HẠNG B</h2>
                                <span class="card-pill pill-yellow">SỐ SÀN</span>
                            </div>
                            <div class="card-check">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                        </div>

                        <div class="card-img-wrap">
                            <img src="/banner/vios_cutout.png" alt="Toyota Vios Số Sàn" class="card-img" />
                        </div>

                        <div class="card-footer">
                            <div class="footer-icon">
                                <svg viewBox="0 0 28 28" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                                    <path d="M7 6v16M14 6v16M21 6v16M7 14h14"></path>
                                    <circle cx="7" cy="6" r="1.8" fill="currentColor"></circle>
                                    <circle cx="14" cy="6" r="1.8" fill="currentColor"></circle>
                                    <circle cx="21" cy="6" r="1.8" fill="currentColor"></circle>
                                    <circle cx="7" cy="22" r="1.8" fill="currentColor"></circle>
                                    <circle cx="14" cy="22" r="1.8" fill="currentColor"></circle>
                                    <circle cx="21" cy="22" r="1.8" fill="currentColor"></circle>
                                </svg>
                            </div>
                            <div class="footer-info">
                                <div class="footer-title">Hộp số sàn</div>
                                <div class="footer-subtitle">Luyện tập với xe số cơ khí</div>
                            </div>
                        </div>
                    </div>

                    <!-- Option 3: HẠNG C1 - XE TẢI -->
                    <div class="welcome-card disabled" data-class="c1">
                        <div class="card-header">
                            <div class="card-title-group">
                                <h2 class="card-class-name">HẠNG C1</h2>
                                <span class="card-pill pill-blue">Sắp ra mắt</span>
                            </div>
                            <div class="card-lock">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                        </div>

                        <div class="card-img-wrap">
                            <img src="/banner/truck_cutout.png" alt="Xe Tải Hạng C1" class="card-img" />
                        </div>

                        <div class="card-footer">
                            <div class="footer-icon">
                                <svg viewBox="0 0 28 28" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="6" width="15" height="13" rx="1.5"></rect>
                                    <path d="M17 10h5l3 4v5h-8v-9z"></path>
                                    <circle cx="7" cy="21" r="2.5"></circle>
                                    <circle cx="21" cy="21" r="2.5"></circle>
                                </svg>
                            </div>
                            <div class="footer-info">
                                <div class="footer-title">Xe tải</div>
                                <div class="footer-subtitle">Đang cập nhật. Vui lòng quay lại sau!</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Features Highlights Ribbon -->
                <div class="welcome-highlights">
                    <div class="highlight-item">
                        <div class="highlight-icon-wrap">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                        </div>
                        <div class="highlight-text">
                            <div class="highlight-title">Môi trường 3D chân thực</div>
                            <div class="highlight-desc">Mô phỏng sát với sân sát hạch thực tế</div>
                        </div>
                    </div>

                    <div class="highlight-item">
                        <div class="highlight-icon-wrap">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="9"></circle>
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M12 3v6M12 15v6M3 12h6M15 12h6"></path>
                            </svg>
                        </div>
                        <div class="highlight-text">
                            <div class="highlight-title">Thao tác điều khiển đầy đủ</div>
                            <div class="highlight-desc">Làm quen các nút chức năng trên xe</div>
                        </div>
                    </div>

                    <div class="highlight-item">
                        <div class="highlight-icon-wrap">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <div class="highlight-text">
                            <div class="highlight-title">Rèn luyện kỹ năng</div>
                            <div class="highlight-desc">Tự tin trước kỳ sát hạch thật</div>
                        </div>
                    </div>

                    <div class="highlight-item">
                        <div class="highlight-icon-wrap">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                        </div>
                        <div class="highlight-text">
                            <div class="highlight-title">Nhận biết lỗi vi phạm</div>
                            <div class="highlight-desc">Giúp bạn cải thiện và tiến bộ hơn!</div>
                        </div>
                    </div>
                </div>

                <!-- Primary CTA Start Button -->
                <div class="welcome-action">
                    <button class="welcome-start-btn" id="welcomeStartBtn" type="button">
                        <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="6 4 20 12 6 20 6 4"></polygon>
                        </svg>
                        <span>BẮT ĐẦU BÀI HỌC</span>
                    </button>
                </div>
            </div>

            <!-- Guide Modal - Thiết kế bài học sa hình chuẩn sát hạch -->
            <div class="guide-modal-backdrop" id="guideModalBackdrop" style="display: none;">
                <div class="guide-modal-box" role="dialog" aria-modal="true" aria-labelledby="guideModalTitle">
                    <!-- Close Button Top Right -->
                    <button class="guide-close-btn" id="guideCloseBtn" type="button" aria-label="Đóng">✕</button>

                    <!-- Modal Header -->
                    <div class="guide-modal-header" id="guideModalHeader">
                        <div class="guide-header-icon">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                            </svg>
                        </div>
                        <div class="guide-header-text">
                            <h2 class="guide-modal-title" id="guideModalTitle">
                                BÀI HỌC MÔ PHỎNG <span class="guide-title-highlight">SA HÌNH</span>
                            </h2>
                            <p class="guide-desc">
                                Chào mừng bạn đến với bài học mô phỏng sa hình. Tại đây, bạn sẽ được làm quen với quy trình sát hạch, thứ tự các bài thi và các yêu cầu quan trọng trước khi bắt đầu thực hành.
                            </p>
                            <div class="guide-standards-highlight">
                                <div class="guide-standard-item">
                                    <span class="guide-standard-label">Tiêu chuẩn sân:</span>
                                    <strong class="guide-standard-code">QCVN 15:2026/BCA</strong>
                                </div>
                                <div class="guide-standard-item">
                                    <span class="guide-standard-label">Quy định về bài thi sa hình:</span>
                                    <strong class="guide-standard-code">TT 12/2025/TT-BCA và TT 108/2026/TT-BCA</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Information Strip -->
                    <div class="guide-meta-strip" id="guideMetaStrip">
                        <div class="guide-meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.8C2.1 11 2 11.3 2 11.6V16c0 .6.4 1 1 1h2"></path>
                                <circle cx="7" cy="17" r="2"></circle>
                                <circle cx="17" cy="17" r="2"></circle>
                            </svg>
                            <span class="meta-label">Hạng B</span>
                        </div>
                        <div class="meta-divider"></div>
                        <div class="guide-meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                            </svg>
                            <span class="meta-label">11 bài liên hoàn</span>
                        </div>
                        <div class="meta-divider"></div>
                        <div class="guide-meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span class="meta-label">Thời gian: <strong class="meta-time">18 phút</strong></span>
                        </div>
                    </div>

                    <!-- Main Body: 2 Columns Overview -->
                    <div class="guide-body-view" id="guideOverviewView">
                        <div class="guide-grid">
                            <!-- Left Column -->
                            <div class="guide-col-left">
                                <div class="guide-card-block">
                                    <div class="guide-block-header">
                                        <div class="guide-block-icon icon-teal">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                            </svg>
                                        </div>
                                        <h3 class="guide-block-title">Giới thiệu</h3>
                                    </div>
                                    <ul class="guide-bullet-list">
                                        <li>
                                            <span class="bullet-badge badge-green">✓</span>
                                            <span>Mô phỏng đầy đủ quy trình sát hạch thực hành lái xe trong hình.</span>
                                        </li>
                                        <li>
                                            <span class="bullet-badge badge-green">✓</span>
                                            <span>Giúp học viên ghi nhớ thứ tự bài thi, thao tác chuẩn và các lỗi cần tránh.</span>
                                        </li>
                                        <li>
                                            <span class="bullet-badge badge-green">✓</span>
                                            <span>Hỗ trợ luyện tập nhiều lần trước khi bước vào sân sát hạch thực tế.</span>
                                        </li>
                                    </ul>
                                </div>

                                <div class="guide-card-block">
                                    <div class="guide-block-header">
                                        <div class="guide-block-icon icon-yellow">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                            </svg>
                                        </div>
                                        <h3 class="guide-block-title">Lưu ý quan trọng</h3>
                                    </div>
                                    <ul class="guide-bullet-list">  <li>
                                            <span class="bullet-badge badge-yellow">!</span>
                                            <span>Chú ý các tình huống nguy hiểm xuất hiện ngẫu nhiên trên sân.</span>
                                        </li>
                                        <li>
                                            <span class="bullet-badge badge-yellow">!</span>
                                            <span>Thực hiện đúng trình tự các bài sát hạch.</span>
                                        </li>
                                        <li>
                                            <span class="bullet-badge badge-yellow">!</span>
                                            <span>Chấp hành tín hiệu giao thông và giữ tốc độ đúng quy định.</span>
                                        </li>
                                        <li>
                                            <span class="bullet-badge badge-yellow">!</span>
                                            <span>Khi rẽ hoặc chuyển hướng, phải bật xi nhan.</span>
                                        </li>
                                      
                                    </ul>
                                </div>
                            </div>

                            <!-- Right Column: Trình tự 11 bài học -->
                            <div class="guide-col-right">
                                <div class="guide-block-header">
                                    <div class="guide-block-icon icon-teal">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                            <line x1="8" y1="6" x2="21" y2="6"></line>
                                            <line x1="8" y1="12" x2="21" y2="12"></line>
                                            <line x1="8" y1="18" x2="21" y2="18"></line>
                                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                        </svg>
                                    </div>
                                    <h3 class="guide-block-title">Trình tự 11 bài học</h3>
                                </div>
                                <div class="guide-task-list">
                                    <div class="guide-task-row"><span class="task-num">1</span><span class="task-name">Xuất phát</span></div>
                                    <div class="guide-task-row"><span class="task-num">2</span><span class="task-name">Dừng xe nhường đường cho người đi bộ</span></div>
                                    <div class="guide-task-row"><span class="task-num">3</span><span class="task-name">Dừng và khởi hành xe ngang dốc</span></div>
                                    <div class="guide-task-row"><span class="task-num">4</span><span class="task-name">Qua vệt bánh xe và đường vòng vuông góc</span></div>
                                    <div class="guide-task-row"><span class="task-num">5</span><span class="task-name">Qua ngã tư có tín hiệu điều khiển giao thông</span></div>
                                    <div class="guide-task-row"><span class="task-num">6</span><span class="task-name">Qua đường vòng quanh co</span></div>
                                    <div class="guide-task-row"><span class="task-num">7</span><span class="task-name">Ghép xe dọc vào nơi đỗ</span></div>
                                    <div class="guide-task-row"><span class="task-num">8</span><span class="task-name">Ghép xe ngang vào nơi đỗ</span></div>
                                    <div class="guide-task-row"><span class="task-num">9</span><span class="task-name">Tạm dừng ở chỗ có đường sắt chạy qua</span></div>
                                    <div class="guide-task-row"><span class="task-num">10</span><span class="task-name">Thay đổi số trên đường thẳng</span></div>
                                    <div class="guide-task-row"><span class="task-num">11</span><span class="task-name">Kết thúc</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Infographic View (Toggled when user clicks XEM HƯỚNG DẪN) -->
                    <div class="guide-body-view" id="guideControlsView" style="display: none;">
                        <div class="guide-slider">
                            <div class="guide-slider-track" id="guideSliderTrack">
                                <img src="/banner/huongdan1.jpg" alt="Hướng dẫn điều khiển" class="guide-slide-img" />
                                <img src="/banner/huongdan2.jpg" alt="Hướng dẫn giao diện" class="guide-slide-img" />
                            </div>
                            <button class="guide-slider-arrow prev" id="guideSliderPrev" type="button" aria-label="Ảnh trước">❮</button>
                            <button class="guide-slider-arrow next" id="guideSliderNext" type="button" aria-label="Ảnh sau">❯</button>
                        </div>
                        <div class="guide-slider-dots">
                            <span class="guide-slider-dot active" data-index="0"></span>
                            <span class="guide-slider-dot" data-index="1"></span>
                        </div>
                        <div class="guide-controls-container" style="display: none;">
                            <div class="guide-block-header">
                                <div class="guide-block-icon icon-teal">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                        <line x1="6" y1="8" x2="6" y2="8"></line>
                                        <line x1="10" y1="8" x2="10" y2="8"></line>
                                        <line x1="14" y1="8" x2="14" y2="8"></line>
                                        <line x1="18" y1="8" x2="18" y2="8"></line>
                                        <line x1="8" y1="16" x2="16" y2="16"></line>
                                    </svg>
                                </div>
                                <h3 class="guide-block-title">Bảng phím điều khiển xe mô phỏng</h3>
                            </div>
                            <table class="guide-table">
                                <tr><td><span class="guide-key">Enter</span></td><td>Bật / Tắt động cơ (Start Engine)</td></tr>
                                <tr><td><span class="guide-key">W</span> / <span class="guide-key">↑</span></td><td>Đạp chân ga (Tăng tốc)</td></tr>
                                <tr><td><span class="guide-key">S</span> / <span class="guide-key">↓</span></td><td>Đạp chân phanh (Giảm tốc)</td></tr>
                                <tr><td><span class="guide-key">A</span> / <span class="guide-key">D</span> hoặc <span class="guide-key">←</span> / <span class="guide-key">→</span></td><td>Đánh lái trái / phải</td></tr>
                                <tr><td><span class="guide-key">Shift</span></td><td>Đạp bàn đạp côn (Clutch - xe số sàn)</td></tr>
                                <tr><td><span class="guide-key">1</span> - <span class="guide-key">5</span>, <span class="guide-key">N</span>, <span class="guide-key">R</span></td><td>Cần số: Số 1 đến 5, Mo (N), Lùi (R)</td></tr>
                                <tr><td><span class="guide-key">Space</span></td><td>Phanh tay (Handbrake)</td></tr>
                                <tr><td><span class="guide-key">C</span></td><td>Đổi góc nhìn Camera (Cabin / Sau xe / Toàn cảnh)</td></tr>
                            </table>
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div class="guide-modal-footer">

                        <div class="guide-footer-actions">
                            <button class="guide-btn-secondary" id="guideControlsBtn" type="button">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                </svg>
                                <span id="guideControlsBtnText">XEM HƯỚNG DẪN</span>
                            </button>

                            <button class="guide-btn-close" id="guideCloseBtnBottom" type="button">
                                <span>✕ ĐÓNG</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Toast notification -->
            <div class="welcome-toast" id="welcomeToast"></div>
        `;
    }

    private bindEvents(): void {
        const cards = this.root.querySelectorAll<HTMLDivElement>('.welcome-card');
        const startBtn = this.root.querySelector<HTMLButtonElement>('#welcomeStartBtn');
        const guideBtn = this.root.querySelector<HTMLButtonElement>('#welcomeGuideBtn');
        const guideModal = this.root.querySelector<HTMLDivElement>('#guideModalBackdrop');
        const guideCloseBtn = this.root.querySelector<HTMLButtonElement>('#guideCloseBtn');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const opt = card.dataset.class as WelcomeClassOption;
                if (card.classList.contains('disabled')) {
                    if (opt === 'b-auto') {
                        this.showToast('Hạng B (Số tự động) đang trong quá trình cập nhật. Vui lòng quay lại sau!');
                    } else {
                        this.showToast('Hạng C1 (Xe tải) đang trong quá trình cập nhật. Vui lòng quay lại sau!');
                    }
                    return;
                }
                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedClass = opt;
            });
        });

        startBtn?.addEventListener('click', () => {
            this.hide();
            if (this.onStartCallback) {
                this.onStartCallback(this.selectedClass);
            }
            // Hiện bảng hướng dẫn sử dụng với nút 'BẮT ĐẦU'
            this.showGuide(true);
            this.guideReturnFocus = undefined;
        });

        guideBtn?.addEventListener('click', () => {
            this.showGuide(false);
        });

        guideCloseBtn?.addEventListener('click', () => {
            this.hideGuide();
        });

        const guideCloseBtnBottom = this.root.querySelector<HTMLButtonElement>('#guideCloseBtnBottom');
        const guideControlsBtn = this.root.querySelector<HTMLButtonElement>('#guideControlsBtn');
        const guideControlsBtnText = this.root.querySelector<HTMLSpanElement>('#guideControlsBtnText');
        const guideOverviewView = this.root.querySelector<HTMLDivElement>('#guideOverviewView');
        const guideControlsView = this.root.querySelector<HTMLDivElement>('#guideControlsView');

        guideCloseBtnBottom?.addEventListener('click', () => {
            const beginsLesson = this.guideOpenedFromStart;
            this.hideGuide();
            if (beginsLesson) this.onBeginLessonCallback?.();
        });

        const guideModalHeader = this.root.querySelector<HTMLDivElement>('#guideModalHeader');
        const guideMetaStrip = this.root.querySelector<HTMLDivElement>('#guideMetaStrip');

        let isShowingControls = false;
        guideControlsBtn?.addEventListener('click', () => {
            isShowingControls = !isShowingControls;
            if (guideOverviewView && guideControlsView && guideControlsBtnText) {
                // Ảnh hướng dẫn chiếm toàn bộ vùng nội dung: ẩn header + thanh thông tin
                const overviewDisplay = isShowingControls ? 'none' : '';
                if (guideModalHeader) guideModalHeader.style.display = overviewDisplay;
                if (guideMetaStrip) guideMetaStrip.style.display = overviewDisplay;
                guideOverviewView.style.display = isShowingControls ? 'none' : 'block';
                guideControlsView.style.display = isShowingControls ? 'block' : 'none';
                guideControlsBtnText.textContent = isShowingControls ? 'XEM BÀI HỌC' : 'XEM HƯỚNG DẪN';
                if (isShowingControls) setGuideSlide(0);
            }
        });

        // Slider 2 ảnh hướng dẫn
        const sliderTrack = this.root.querySelector<HTMLDivElement>('#guideSliderTrack');
        const sliderDots = this.root.querySelectorAll<HTMLSpanElement>('.guide-slider-dot');
        let guideSlideIndex = 0;
        const setGuideSlide = (index: number) => {
            guideSlideIndex = (index + sliderDots.length) % sliderDots.length;
            if (sliderTrack) sliderTrack.style.transform = `translateX(-${guideSlideIndex * 100}%)`;
            sliderDots.forEach((dot, i) => dot.classList.toggle('active', i === guideSlideIndex));
        };
        this.root.querySelector('#guideSliderPrev')?.addEventListener('click', () => setGuideSlide(guideSlideIndex - 1));
        this.root.querySelector('#guideSliderNext')?.addEventListener('click', () => setGuideSlide(guideSlideIndex + 1));
        sliderDots.forEach((dot, i) => dot.addEventListener('click', () => setGuideSlide(i)));

        guideModal?.addEventListener('click', (e) => {
            if (e.target === guideModal) {
                this.hideGuide();
            }
        });
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Escape' && this.guideModal.style.display !== 'none') this.hideGuide();
        });
    }

    public showGuide(fromStart: boolean = false): void {
        this.guideOpenedFromStart = fromStart;
        this.guideReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
        this.updateGuideCloseButton(fromStart);
        this.guideModal.style.display = 'flex';
        this.guideModal.querySelector<HTMLButtonElement>(fromStart ? '#guideCloseBtnBottom' : '#guideCloseBtn')?.focus();
    }

    private updateGuideCloseButton(fromStart: boolean): void {
        const guideCloseBtnBottom = this.guideModal.querySelector<HTMLButtonElement>('#guideCloseBtnBottom');
        if (!guideCloseBtnBottom) return;

        if (fromStart) {
            guideCloseBtnBottom.className = 'guide-btn-start';
            guideCloseBtnBottom.innerHTML = `
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <polygon points="6 4 20 12 6 20 6 4"></polygon>
                </svg>
                <span>BẮT ĐẦU</span>
            `;
            guideCloseBtnBottom.setAttribute('aria-label', 'Bắt đầu bài học');
        } else {
            guideCloseBtnBottom.className = 'guide-btn-close';
            guideCloseBtnBottom.innerHTML = `<span>✕ ĐÓNG</span>`;
            guideCloseBtnBottom.setAttribute('aria-label', 'Đóng hướng dẫn');
        }
    }

    private hideGuide(): void {
        this.guideOpenedFromStart = false;
        this.guideModal.style.display = 'none';
        this.updateGuideCloseButton(false);
        this.guideReturnFocus?.focus();
    }

    public show(): void {
        this.root.classList.remove('hidden');
    }

    public hide(): void {
        this.root.classList.add('hidden');
    }

    public isVisible(): boolean {
        return !this.root.classList.contains('hidden');
    }

    public getSelectedClass(): WelcomeClassOption {
        return this.selectedClass;
    }

    private showToast(msg: string): void {
        const toast = this.root.querySelector<HTMLDivElement>('#welcomeToast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(this.toastTimer);
        this.toastTimer = window.setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}
