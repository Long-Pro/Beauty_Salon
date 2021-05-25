﻿CREATE DATABASE BEAUTY_SALON
GO
USE BEAUTY_SALON
GO



CREATE TABLE LOAIKHACH
(
	MA VARCHAR(3) PRIMARY KEY,
	TENLOAI NVARCHAR(15) NOT NULL,
	TILE_GIAMGIA INT NOT NULL,
	MOCDIEMTICHLUY INT NOT NULL
)
INSERT INTO LOAIKHACH VALUES('LK1',N'KHÁCH THƯỜNG',0,0)
INSERT INTO LOAIKHACH VALUES('LK2',N'KHÁCH VIP1',5,70)
INSERT INTO LOAIKHACH VALUES('LK3',N'KHÁCH VIP2',7,150)
INSERT INTO LOAIKHACH VALUES('LK4',N'KHÁCH VIP3',10,200)




CREATE TABLE KHACHHANG
(
	MA VARCHAR(10) PRIMARY KEY,
	TEN NVARCHAR(30) ,
	SDT VARCHAR(10) NOT NULL,
	GIOITINH NVARCHAR(5),
	MALK VARCHAR(3) FOREIGN KEY REFERENCES LOAIKHACH(MA),
	DIEMTICHLUY INT 
) 
INSERT INTO KHACHHANG VALUES('KH00000001',N'Guest From Nowhere','0398291600',N'Nam','LK1',0)
INSERT INTO KHACHHANG VALUES('KH00000002',N'Lù Vĩnh Trường','0398291601',N'Nam','LK1',0)
INSERT INTO KHACHHANG VALUES('KH00000003',N'Lê Thị Thư','0398291602',N'Nữ','LK1',0)
INSERT INTO KHACHHANG VALUES('KH00000004',N'Nguyễn Văn Long','0398291603',N'Nam','LK1',0)
INSERT INTO KHACHHANG VALUES('KH00000005',N'Lục Văn Đạt','0398291604',N'Nam','LK1',0)





CREATE TABLE TAIKHOAN
(	
	MAKH VARCHAR(10) FOREIGN KEY REFERENCES KHACHHANG(MA),
	TAIKHOAN VARCHAR(12) PRIMARY KEY,
	MATKHAU VARCHAR(150)
)
	
INSERT INTO TAIKHOAN VALUES('KH00000001','BachCongTu','e10adc3949ba59abbe56e057f20f883e')
INSERT INTO TAIKHOAN VALUES('KH00000002','Thu123','670b14728ad9902aecba32e22fa4f6bd')





CREATE TABLE NHANVIEN
(
	MA NVARCHAR(10) PRIMARY KEY,
	TEN NVARCHAR(30) NOT NULL,
	SDT VARCHAR(10) NOT NULL,
	GIOITINH NVARCHAR(5),
	EMAIL VARCHAR(30),
	CMND VARCHAR(15),
	NGAYSINH VARCHAR(15),
	DIACHI NVARCHAR(50),
	TRANGTHAI INT ,
	TAIKHOAN VARCHAR(12) ,
	MATKHAU VARCHAR(150),
	LOAINHANVIEN VARCHAR(5)

)



INSERT INTO NHANVIEN VALUES(N'Hiếu01',N'Nguyễn Trung Hiếu','0398291605',N'Nam',N'hieu@gmail.com','197401001',N'2021-04-24',N'97 Man Thiện, quận 9, HCM',1,N'Hieu123','670b14728ad9902aecba32e22fa4f6bd','admin')
INSERT INTO NHANVIEN VALUES(N'Hy02',N'Nguyễn Tá Hy','0398291606',N'Nam',N'hy@gmail.com','197401002',N'2000-04-24',N'98 Man Thiện, quận 9, HCM',1,N'Hy1234','670b14728ad9902aecba32e22fa4f6bd','admin')
INSERT INTO NHANVIEN VALUES(N'Hoa03',N'Nguyễn Thị Hoa','0398291607',N'Nữ',N'hoa@gmail.com','197401003',N'1999-04-24',N'99 Man Thiện, quận 9, HCM',1,N'Hoa123','670b14728ad9902aecba32e22fa4f6bd','nv')
INSERT INTO NHANVIEN VALUES(N'Tom04',N'Huỳnh Thanh Tom','0398291608',N'Nam',N'tom@gmail.com','197401004',N'2021-04-24',N'99 Man Thiện, quận 9, HCM',1,N'Tom123','670b14728ad9902aecba32e22fa4f6bd','nv')
INSERT INTO NHANVIEN VALUES(N'Hải05',N'Huỳnh Minh Hải','0398291609',N'Nam',N'hai@gmail.com','197401005',N'1998-04-24',N'99 Man Thiện, quận 9, HCM',0,'Nam123','670b14728ad9902aecba32e22fa4f6bd','nv')






CREATE TABLE LOAIDICHVU
(
	MA VARCHAR(5) PRIMARY KEY,
	TEN NVARCHAR(30) NOT NULL
)
INSERT INTO LOAIDICHVU VALUES('LD001',N'CẮT TÓC')
INSERT INTO LOAIDICHVU VALUES('LD002',N'UỐN')
INSERT INTO LOAIDICHVU VALUES('LD003',N'NHUỘM')
INSERT INTO LOAIDICHVU VALUES('LD004',N'DỊCH VỤ KHÁC')



CREATE TABLE DICHVU
(
	MA VARCHAR(5) PRIMARY KEY,
	MALDV VARCHAR(5) FOREIGN KEY REFERENCES LOAIDICHVU(MA),
	TEN NVARCHAR(50) NOT NULL,
	GIA INT NOT NULL,
	MOTA NTEXT NOT NULL,
	DIEMCONGTICHLUY INT NOT NULL,
	UNIQUE (TEN)
)
INSERT INTO DICHVU VALUES('DV001','LD001',N'CẮT XẢ',70000, N'Tạo kiểu nhanh gọn, không gội đầu massage',2)
INSERT INTO DICHVU VALUES('DV002','LD001',N'VIP COMBO CẮT GỘI',199000, N'Mặt nạ vàng 24K, Tẩy da chết sủi bọt, Detox muối lộc massage con kiến & giường massage',3)
INSERT INTO DICHVU VALUES('DV003','LD001',N'KID COMBO',70000, N'Cắt tóc gội đầu trẻ em (mỹ phẩm riêng cho trẻ em)',2)
INSERT INTO DICHVU VALUES('DV004','LD002',N'UỐN CAO CẤP HÀN',349000, N'Thuốc uốn ATS của Hàn nhập khẩu chính ngạch, chứa Amino Axit tinh khiết giúp giảm thiểu tối đa tổn thương tóc từ bên trong',4)
INSERT INTO DICHVU VALUES('DV005','LD002',N'UỐN',260000, N'Thuốc uốn Hàn hương cafe nhập khẩu chính ngạch, tạo sóng tốt, căng và bóng',3)
INSERT INTO DICHVU VALUES('DV006','LD003',N'NHUỘM PHỦ BẠC THẢO DƯỢC',180000, N'Thuốc nhuộm Hàn được chiết xuất từ 6 loại thảo dược giúp tóc đen bóng, da đầu chắc khoẻ',3)
INSERT INTO DICHVU VALUES('DV007','LD003',N'NHUỘM CÁC TÔNG NÂU ĐỎ, NÂU VÀNG',249000, N'Màu nhuộm Echoslise chứa sáp ong, Vitamin C và dầu dừa, vượt qua nhiều tiêu chuẩn khắt khe để trở thành dòng màu nhuộm được ưa chuộng hàng đầu tại các salon cao cấp ở Châu Âu và Italy',4)
INSERT INTO DICHVU VALUES('DV008','LD003',N'NHUỘM MÀU THỜI TRANG NỔI BẬT',289000, N'Màu nhuộm Italy nhập khẩu chính hãng, chứa thành phần sáp ong, dầu dừa giúp tóc bóng mượt hơn ngay sau khi nhuộm.',4)
INSERT INTO DICHVU VALUES('DV009','LD004',N'LẤY RÁY TAI',30000, N'Quy trình chuyên nghiệp, hiện tại, an toàn, dụng cụ sử dụng 1 lần',1)
INSERT INTO DICHVU VALUES('DV010','LD004',N'ĐẮP MẶT NẠ',30000, N'Mặt nạ dưỡng chất Hàn Quốc, an toàn, phù hợp nhiều loại da',1)
INSERT INTO DICHVU VALUES('DV011','LD004',N'TẨY DA CHẾT SỦI BỌT',25000, N'Công nghệ sủi bọt tiên tiến, đánh bay da chết, bụi bẩn, bã nhờ sâu bên trong',1)
INSERT INTO DICHVU VALUES('DV012','LD004',N'LẤY MỤN BẰNG QUE GẠT',30000, N'Sử dụng mỹ phẩm đẩy cồi mụn kết hợp que gạt lấy nhân mụn (chỉ dùng 1 lần riêng từng khách)',1)
INSERT INTO DICHVU VALUES('DV013','LD004',N'HẤP DƯỠNG TINH CHẤT OLIU',119000, N'Đem lại mái tóc bóng mượt chắc khỏe từ dưỡng chất bơ oliu chiết xuất hoàn toàn tự nhiên',1)








 CREATE TABLE HOADON
 (
	MA VARCHAR(10) PRIMARY KEY,
	MAKHACH VARCHAR(10)  FOREIGN KEY REFERENCES KHACHHANG(MA),
	THOIGIAN VARCHAR(30) NOT NULL,
	MANV NVARCHAR(10)  FOREIGN KEY REFERENCES NHANVIEN(MA),
	TILE_GIAMGIA INT,
 )
 CREATE TABLE SD_DICHVU
 (
	MAHD  VARCHAR(10)  FOREIGN KEY REFERENCES HOADON(MA),
	MANV  NVARCHAR(10)  FOREIGN KEY REFERENCES NHANVIEN(MA),
	MADV  VARCHAR(5)  FOREIGN KEY REFERENCES DICHVU(MA),
	GIA INT NOT NULL,
	CONSTRAINT PK_SD_DV PRIMARY KEY (MAHD,MANV,MADV)
 )
 CREATE TABLE DATTRUOC
(	
	MA VARCHAR(10) PRIMARY KEY,
	MAKHACH VARCHAR(10)  FOREIGN KEY REFERENCES KHACHHANG(MA),
	THOIGIAN VARCHAR(30) NOT NULL,
	TRANGTHAI INT DEFAULT 0,
)
CREATE TABLE SD_DICHVU_DATTRUOC
(
	MAHD  VARCHAR(10) NOT NULL FOREIGN KEY REFERENCES DATTRUOC(MA),
	MADV  VARCHAR(5) NOT NULL FOREIGN KEY REFERENCES DICHVU(MA),
	GIA INT NOT NULL,
	CONSTRAINT PK_SD_DV_DATTRUOC PRIMARY KEY (MAHD,MADV)
)
 