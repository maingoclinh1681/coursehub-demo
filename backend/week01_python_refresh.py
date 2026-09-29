from ast import keyword


print("CourseHub - Buoi 1")

# Mô phỏng dữ liệu:
students = [
    {"id": "22000001", "name": "Nguyen Minh Anh", "major": "KHDL"},
    {"id": "22000002", "name": "Tran Duc Long", "major": "KHDL"},
]
courses = [
    {
        "code": "INT2204",
        "name": "Co so du lieu Web va he thong thong tin",
        "capacity": 3,
    "enrolled": 2,
    },
    {
        "code": "INT2205",
        "name": "Khai pha du lieu",
        "capacity": 2,
        "enrolled": 2,
    },
]
enrollments = [
    {"student_id": "22000001", "course_code": "INT2204"}
]

# Duyệt dữ liệu và tính giá trị
for course in courses:
    remaining = course["capacity"] - course["enrolled"]
    print(course["code"], "- con", remaining, "cho")

# Tách xử lý thành hàm:
def find_course(course_code):
    for course in courses:
        if course["code"] == course_code:
            return course
    return None
print(find_course("INT2204"))


# Mô phỏng quy tắc đăng ký:
def can_enroll(student_id, course_code):
    course = find_course(course_code)
    if course is None:
        return False, "Hoc phan khong ton tai"
    if course["enrolled"] >= course["capacity"]:
        return False, "Lop da du so luong"
    duplicated = any(
        item["student_id"] == student_id and item["course_code"] == course_code
        for item in enrollments
    )
    if duplicated:
        return False, "Sinh vien da dang ky hoc phan nay"
    return True, "Co the dang ky"
print(can_enroll("22000002", "INT2204"))

# Xử lý lỗi: 
try:
    limit = int(input("Nhap so luong hoc phan muon hien thi: "))
    print(courses[:limit])
except ValueError:
    print("So luong phai la so nguyen")

# Hàm tìm kiếm học phần, không phân biệt hoa thường:
def search_courses(keyword):
    normalized = keyword.strip().lower()
    results = []
    for course in courses:
        code = course["code"].lower()
        name = course["name"].lower()
        if normalized in code or normalized in name:
            results.append(course)
    return results
print(search_courses("web"))

# Bổ sung:
print("Done")

# Bài tập làm thêm: Hàm đăng ký học phần.
def enroll_student(student_id, course_code):
    # Kiểm tra sinh viên tồn tại
    student_exists = False

    for student in students:
        if student["id"] == student_id:
            student_exists = True
            break

    if not student_exists:
        print("Sinh viên không tồn tại.")
        return

    # Kiểm tra học phần tồn tại
    course = None

    for c in courses:
        if c["code"] == course_code:
            course = c
            break

    if course is None:
        print("Học phần không tồn tại.")
        return

    # Kiểm tra lớp còn chỗ
    if course["enrolled"] >= course["capacity"]:
        print("Lớp đã đầy.")
        return

    # Kiểm tra sinh viên đã đăng ký học phần chưa
    for enrollment in enrollments:
        if (enrollment["student_id"] == student_id
                and enrollment["course_code"] == course_code):
            print("Sinh viên đã đăng ký học phần này.")
            return

    # Thêm bản ghi đăng ký
    enrollments.append({
        "student_id": student_id,
        "course_code": course_code
    })

    # Cập nhật số lượng sinh viên
    course["enrolled"] += 1

    print("Đăng ký học phần thành công.")

enroll_student("22000001", "INT2204")
enroll_student("22000001", "INT2205")
enroll_student("24000001", "INT2204")
enroll_student("22000001", "INT3508")
enroll_student("22000002", "INT2204")