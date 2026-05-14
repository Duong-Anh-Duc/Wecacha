export type District = string;

export type Province = {
  name: string;
  districts: District[];
};

export const VIETNAM_PROVINCES: Province[] = [
  {
    name: "Hà Nội",
    districts: [
      "Ba Đình", "Hoàn Kiếm", "Hai Bà Trưng", "Đống Đa", "Tây Hồ",
      "Cầu Giấy", "Thanh Xuân", "Hoàng Mai", "Long Biên", "Nam Từ Liêm",
      "Bắc Từ Liêm", "Hà Đông", "Sơn Tây", "Ba Vì", "Chương Mỹ",
      "Đan Phượng", "Đông Anh", "Gia Lâm", "Hoài Đức", "Mê Linh",
      "Mỹ Đức", "Phú Xuyên", "Phúc Thọ", "Quốc Oai", "Sóc Sơn",
      "Thạch Thất", "Thanh Oai", "Thanh Trì", "Thường Tín", "Ứng Hòa",
      "Kim Bôi", "Lạc Sơn", "Lương Sơn", "Kỳ Sơn", "Tân Lạc",
      "Cao Phong", "Đà Bắc", "Lạc Thủy", "Mai Châu", "Yên Thủy"
    ]
  },
  {
    name: "Hồ Chí Minh",
    districts: [
      "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6",
      "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12",
      "Bình Thạnh", "Gò Vấp", "Phú Nhuận", "Tân Bình", "Tân Phú",
      "Bình Tân", "Thủ Đức", "Bình Chánh", "Cần Giờ", "Củ Chi",
      "Hóc Môn", "Nhà Bè",
      "Dĩ An", "Thuận An", "Thủ Dầu Một", "Bến Cát", "Phú Giáo",
      "Tân Uyên", "Bắc Tân Uyên", "Bàu Bàng", "Dầu Tiếng",
      "Bến Lức", "Cần Đước", "Cần Giuộc", "Châu Thành", "Đức Hòa",
      "Đức Huệ", "Mộc Hóa", "Tân An", "Tân Hưng", "Tân Thạnh",
      "Tân Trụ", "Thạnh Hóa", "Thủ Thừa", "Vĩnh Hưng"
    ]
  },
  {
    name: "Hải Phòng",
    districts: [
      "Hồng Bàng", "Lê Chân", "Ngô Quyền", "Kiến An", "Hải An",
      "Đồ Sơn", "Dương Kinh", "An Dương", "An Lão", "Bạch Long Vĩ",
      "Cát Hải", "Kiến Thụy", "Thủy Nguyên", "Tiên Lãng", "Vĩnh Bảo",
      "Chí Linh", "Kinh Môn", "Nam Sách", "Ninh Giang", "Thanh Hà",
      "Thanh Miện", "Tứ Kỳ", "Bình Giang", "Cẩm Giàng", "Gia Lộc",
      "Kim Thành", "Kim Động", "Khoái Châu", "Mỹ Hào", "Phù Cừ",
      "Tiên Lữ", "Văn Giang", "Văn Lâm", "Yên Mỹ"
    ]
  },
  {
    name: "Đà Nẵng",
    districts: [
      "Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu",
      "Cẩm Lệ", "Hòa Vang", "Hoàng Sa",
      "Hội An", "Điện Bàn", "Duy Xuyên", "Đại Lộc", "Đông Giang",
      "Nam Giang", "Nông Sơn", "Núi Thành", "Phước Sơn", "Quế Sơn",
      "Tây Giang", "Thăng Bình", "Tiên Phước", "Hiệp Đức"
    ]
  },
  {
    name: "Cần Thơ",
    districts: [
      "Ninh Kiều", "Bình Thủy", "Cái Răng", "Ô Môn", "Thốt Nốt",
      "Cờ Đỏ", "Phong Điền", "Thới Lai", "Vị Thủy",
      "Châu Thành A", "Long Mỹ", "Ngã Bảy", "Phụng Hiệp", "Vị Thanh"
    ]
  },
  {
    name: "Quảng Ninh",
    districts: [
      "Hạ Long", "Móng Cái", "Cẩm Phả", "Uông Bí", "Đông Triều",
      "Quảng Yên", "Ba Chẽ", "Bình Liêu", "Cô Tô", "Đầm Hà",
      "Hải Hà", "Hoành Bồ", "Tiên Yên", "Vân Đồn"
    ]
  },
  {
    name: "Bắc Ninh",
    districts: [
      "Thành phố Bắc Ninh", "Từ Sơn", "Gia Bình", "Lương Tài",
      "Quế Võ", "Thuận Thành", "Tiên Du", "Yên Phong",
      "Bắc Giang", "Hiệp Hòa", "Lạng Giang", "Lục Nam",
      "Lục Ngạn", "Sơn Động", "Tân Yên", "Việt Yên", "Yên Dũng", "Yên Thế"
    ]
  },
  {
    name: "Vĩnh Phúc",
    districts: [
      "Vĩnh Yên", "Phúc Yên", "Bình Xuyên", "Lập Thạch",
      "Sông Lô", "Tam Đảo", "Tam Dương", "Vĩnh Tường", "Yên Lạc",
      "Việt Trì", "Đoan Hùng", "Hạ Hòa", "Lâm Thao", "Phù Ninh",
      "Tam Nông", "Tân Sơn", "Thanh Ba", "Thanh Sơn", "Thanh Thủy",
      "Yên Lập", "Cẩm Khê",
      "Tuyên Quang", "Chiêm Hóa", "Hàm Yên", "Lâm Bình",
      "Na Hang", "Sơn Dương", "Yên Sơn"
    ]
  },
  {
    name: "Thái Nguyên",
    districts: [
      "Thái Nguyên", "Sông Công", "Phổ Yên", "Đại Từ",
      "Định Hóa", "Đồng Hỷ", "Phú Bình", "Phú Lương", "Võ Nhai"
    ]
  },
  {
    name: "Lào Cai",
    districts: [
      "Lào Cai", "Sa Pa", "Bắc Hà", "Bảo Thắng", "Bảo Yên",
      "Mường Khương", "Si Ma Cai", "Văn Bàn",
      "Yên Bái", "Nghĩa Lộ", "Lục Yên", "Mù Căng Chải",
      "Trạm Tấu", "Trấn Yên", "Văn Chấn", "Văn Yên", "Yên Bình"
    ]
  },
  {
    name: "Điện Biên",
    districts: [
      "Điện Biên Phủ", "Mường Lay", "Điện Biên", "Điện Biên Đông",
      "Mường Ảng", "Mường Chà", "Mường Nhé", "Nậm Pồ", "Tủa Chùa", "Tuần Giáo",
      "Lai Châu", "Mường Tè", "Nậm Nhùn", "Phong Thổ",
      "Sìn Hồ", "Tam Đường", "Tân Uyên", "Than Uyên"
    ]
  },
  {
    name: "Sơn La",
    districts: [
      "Sơn La", "Bắc Yên", "Mai Sơn", "Mộc Châu",
      "Mường La", "Phù Yên", "Quỳnh Nhai", "Sông Mã",
      "Sốp Cộp", "Thuận Châu", "Vân Hồ", "Yên Châu"
    ]
  },
  {
    name: "Hà Giang",
    districts: [
      "Hà Giang", "Bắc Mê", "Bắc Quang", "Đồng Văn",
      "Hoàng Su Phì", "Mèo Vạc", "Quản Bạ", "Quang Bình",
      "Vị Xuyên", "Xín Mần", "Yên Minh",
      "Cao Bằng", "Bảo Lâm", "Bảo Lạc", "Hà Quảng",
      "Hòa An", "Nguyên Bình", "Phục Hòa", "Quảng Hòa",
      "Thạch An", "Thông Nông", "Trà Lĩnh", "Trùng Khánh"
    ]
  },
  {
    name: "Lạng Sơn",
    districts: [
      "Lạng Sơn", "Bắc Sơn", "Bình Gia", "Cao Lộc",
      "Chi Lăng", "Đình Lập", "Hữu Lũng", "Lộc Bình",
      "Tràng Định", "Văn Lãng", "Văn Quan",
      "Bắc Kạn", "Ba Bể", "Bạch Thông", "Chợ Đồn",
      "Chợ Mới", "Na Rì", "Ngân Sơn", "Pác Nặm"
    ]
  },
  {
    name: "Thanh Hóa",
    districts: [
      "Thanh Hóa", "Bỉm Sơn", "Sầm Sơn", "Bá Thước",
      "Cẩm Thủy", "Đông Sơn", "Hà Trung", "Hậu Lộc",
      "Hoằng Hóa", "Lang Chánh", "Mường Lát", "Nga Sơn",
      "Ngọc Lặc", "Như Thanh", "Như Xuân", "Nông Cống",
      "Quan Hóa", "Quan Sơn", "Quảng Xương", "Thạch Thành",
      "Thiệu Hóa", "Thọ Xuân", "Thường Xuân", "Tĩnh Gia",
      "Triệu Sơn", "Vĩnh Lộc", "Yên Định"
    ]
  },
  {
    name: "Nghệ An",
    districts: [
      "Vinh", "Cửa Lò", "Hoàng Mai", "Thái Hòa",
      "Anh Sơn", "Con Cuông", "Diễn Châu", "Đô Lương",
      "Hưng Nguyên", "Kỳ Sơn", "Nam Đàn", "Nghi Lộc",
      "Nghĩa Đàn", "Quế Phong", "Quỳ Châu", "Quỳ Hợp",
      "Quỳnh Lưu", "Tân Kỳ", "Thanh Chương", "Tương Dương", "Yên Thành",
      "Hà Tĩnh", "Hồng Lĩnh", "Kỳ Anh", "Cẩm Xuyên",
      "Can Lộc", "Đức Thọ", "Hương Khê", "Hương Sơn",
      "Lộc Hà", "Nghi Xuân", "Thạch Hà", "Vũ Quang"
    ]
  },
  {
    name: "Quảng Bình",
    districts: [
      "Đồng Hới", "Ba Đồn", "Bố Trạch", "Lệ Thủy",
      "Minh Hóa", "Quảng Ninh", "Quảng Trạch", "Tuyên Hóa",
      "Đông Hà", "Quảng Trị", "Cam Lộ", "Cồn Cỏ",
      "Đa Krông", "Gio Linh", "Hải Lăng", "Hướng Hóa",
      "Triệu Phong", "Vĩnh Linh",
      "Huế", "A Lưới", "Nam Đông", "Phong Điền",
      "Phú Lộc", "Phú Vang", "Quảng Điền"
    ]
  },
  {
    name: "Bình Định",
    districts: [
      "Quy Nhơn", "An Nhơn", "Hoài Nhơn", "An Lão",
      "Hoài Ân", "Phù Cát", "Phù Mỹ", "Tây Sơn",
      "Tuy Phước", "Vân Canh", "Vĩnh Thạnh",
      "Tuy Hòa", "Đông Hòa", "Đồng Xuân", "Phú Hòa",
      "Sông Cầu", "Sơn Hòa", "Sông Hinh", "Tây Hòa", "Tuy An",
      "Pleiku", "An Khê", "Ayun Pa", "Chư Pah",
      "Chư Prông", "Chư Pưh", "Chư Sê", "Đak Đoa",
      "Đak Pơ", "Đức Cơ", "Ia Grai", "Ia Pa",
      "Kbang", "Kông Chro", "Krông Pa", "Mang Yang", "Phú Thiện"
    ]
  },
  {
    name: "Khánh Hòa",
    districts: [
      "Nha Trang", "Cam Ranh", "Ninh Hòa", "Cam Lâm",
      "Khánh Sơn", "Khánh Vĩnh", "Trường Sa", "Vạn Ninh",
      "Phan Rang-Tháp Chàm", "Bác Ái", "Ninh Hải",
      "Ninh Phước", "Ninh Sơn", "Thuận Bắc", "Thuận Nam",
      "Đà Lạt", "Bảo Lâm", "Bảo Lộc", "Cát Tiên",
      "Di Linh", "Đạ Huoai", "Đạ Tẻh", "Đam Rông",
      "Đơn Dương", "Đức Trọng", "Lạc Dương", "Lâm Hà"
    ]
  },
  {
    name: "Đắk Lắk",
    districts: [
      "Buôn Ma Thuột", "Buôn Hồ", "Buôn Đôn", "Cư Kuin",
      "Cư M'gar", "Ea H'leo", "Ea Kar", "Ea Súp",
      "Krông Ana", "Krông Bông", "Krông Búk", "Krông Năng",
      "Krông Pắc", "Lắk", "M'Drắk",
      "Gia Nghĩa", "Cư Jút", "Đắk Glong", "Đắk Mil",
      "Đắk R'Lấp", "Đắk Song", "Krông Nô", "Tuy Đức"
    ]
  },
  {
    name: "Kon Tum",
    districts: [
      "Kon Tum", "Đắk Glei", "Đắk Hà", "Đắk Tô",
      "Ia H'Drai", "Kon Plông", "Kon Rẫy", "Ngọc Hồi",
      "Sa Thầy", "Tu Mơ Rông"
    ]
  },
  {
    name: "Bình Phước",
    districts: [
      "Đồng Xoài", "Bình Long", "Phước Long", "Bù Đăng",
      "Bù Đốp", "Bù Gia Mập", "Chơn Thành", "Đồng Phú",
      "Hớn Quản", "Lộc Ninh", "Phú Riềng"
    ]
  },
  {
    name: "Tây Ninh",
    districts: [
      "Tây Ninh", "Bến Cầu", "Châu Thành", "Dương Minh Châu",
      "Gò Dầu", "Hòa Thành", "Tân Biên", "Tân Châu", "Trảng Bàng"
    ]
  },
  {
    name: "Bà Rịa - Vũng Tàu",
    districts: [
      "Vũng Tàu", "Bà Rịa", "Phú Mỹ", "Châu Đức",
      "Côn Đảo", "Đất Đỏ", "Long Điền", "Xuyên Mộc",
      "Biên Hòa", "Long Khánh", "Cẩm Mỹ", "Định Quán",
      "Long Thành", "Nhơn Trạch", "Tân Phú", "Thống Nhất",
      "Trảng Bom", "Vĩnh Cửu", "Xuân Lộc"
    ]
  },
  {
    name: "Tiền Giang",
    districts: [
      "Mỹ Tho", "Gò Công", "Cai Lậy", "Cái Bè",
      "Châu Thành", "Chợ Gạo", "Gò Công Đông", "Gò Công Tây",
      "Tân Phú Đông", "Tân Phước",
      "Bến Tre", "Ba Tri", "Bình Đại", "Châu Thành",
      "Chợ Lách", "Giồng Trôm", "Mỏ Cày Bắc", "Mỏ Cày Nam", "Thạnh Phú"
    ]
  },
  {
    name: "Vĩnh Long",
    districts: [
      "Vĩnh Long", "Bình Minh", "Bình Tân", "Long Hồ",
      "Mang Thít", "Tam Bình", "Trà Ôn", "Vũng Liêm",
      "Trà Vinh", "Càng Long", "Cầu Kè", "Cầu Ngang",
      "Châu Thành", "Duyên Hải", "Tiểu Cần"
    ]
  },
  {
    name: "Đồng Tháp",
    districts: [
      "Cao Lãnh", "Sa Đéc", "Hồng Ngự", "Châu Thành",
      "Hồng Ngự", "Lai Vung", "Lấp Vò", "Tam Nông",
      "Tân Hồng", "Tháp Mười", "Thanh Bình"
    ]
  },
  {
    name: "An Giang",
    districts: [
      "Long Xuyên", "Châu Đốc", "An Phú", "Châu Phú",
      "Châu Thành", "Chợ Mới", "Phú Tân", "Thoại Sơn",
      "Tịnh Biên", "Tri Tôn",
      "Rạch Giá", "Hà Tiên", "An Biên", "An Minh",
      "Châu Thành", "Giang Thành", "Giồng Riềng", "Gò Quao",
      "Hòn Đất", "Kiên Hải", "Kiên Lương", "Phú Quốc", "U Minh Thượng", "Vĩnh Thuận"
    ]
  },
  {
    name: "Bạc Liêu",
    districts: [
      "Bạc Liêu", "Đông Hải", "Giá Rai", "Hòa Bình",
      "Hồng Dân", "Phước Long", "Vĩnh Lợi",
      "Cà Mau", "Đầm Dơi", "Năm Căn", "Ngọc Hiển",
      "Phú Tân", "Thới Bình", "Trần Văn Thời", "U Minh"
    ]
  },
  {
    name: "Sóc Trăng",
    districts: [
      "Sóc Trăng", "Châu Thành", "Cù Lao Dung", "Kế Sách",
      "Long Phú", "Mỹ Tú", "Mỹ Xuyên", "Ngã Năm",
      "Thạnh Trị", "Trần Đề", "Vĩnh Châu"
    ]
  }
];
