# HPO Driving Simulator – Three.js MVP

Code base mô phỏng sát hạch sa hình 3D chạy trực tiếp trên trình duyệt.

## Có sẵn
- Three.js + TypeScript + Vite
- Xe 3D procedural, không cần asset ngoài
- W/S/A/D + phím mũi tên
- 3 camera: sau xe, trên cao, cabin
- Sân 3D mẫu với vạch giới hạn, cọc tiêu, đường rẽ
- Engine bài thi theo checkpoint
- 100 điểm, trừ 5 điểm khi bánh xe chạm vạch
- HUD: bài hiện tại, điểm, tốc độ, thời gian, số lỗi
- Thi lại và điều khiển cảm ứng cơ bản

## Chạy
```bash
npm install
npm run dev
```
Build:
```bash
npm run build
npm run preview
```

## Nơi chỉnh chính
- `src/game/Track.ts`: hình học sân, vạch, trigger
- `src/game/ExamEngine.ts`: bài thi, thứ tự, điểm
- `src/game/Vehicle.ts`: đặc tính xe

## Hướng nâng cấp
1. Import sân thật từ Blender `.glb/.gltf`
2. Rapier physics cho va chạm/bánh xe chính xác hơn
3. Côn, số, phanh tay, xi nhan, đèn
4. Dừng ngang dốc, ghép xe, dừng đúng vạch
5. Replay toàn lượt thi
6. Âm thanh chấm thi
7. Lưu kết quả HPO
8. Logitech G29/G923
9. Tách luật thi ra JSON

> Đây là code base MVP chạy được để phát triển sản phẩm, chưa phải hệ thống chấm thi chính thức.
# driving_simulation_hpo
