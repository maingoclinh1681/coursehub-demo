import test from "node:test";
import assert from "node:assert/strict";

// Giả lập hàm gọi API cơ bản để kiểm tra luồng xử lý JSON, lỗi HTTP và status 204
async function requestJson(url, options = {}, fetchImpl = globalThis.fetch) {
  const res = await fetchImpl(url, options);
  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("Phản hồi từ server không phải định dạng JSON");
  }

  const data = await res.json();
  if (!res.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail.map((item) => item.msg).join(", ")
      : data.detail || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

test("1. GET thanh cong tra ve du lieu JSON", async () => {
  const mockFetch = async () =>
    new Response(JSON.stringify([{ class_id: "WEB-01" }]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  const data = await requestJson("/api/sections", {}, mockFetch);
  assert.equal(data[0].class_id, "WEB-01");
});

test("2. AbortError duoc giu nguyen khi request bi huy", async () => {
  const mockFetch = async () => {
    throw new DOMException("Aborted", "AbortError");
  };
  await assert.rejects(() => requestJson("/api/sections", {}, mockFetch), {
    name: "AbortError",
  });
});

test("3. Loi mang nem thong bao ro rang", async () => {
  const mockFetch = async () => {
    throw new TypeError("Failed to fetch");
  };
  await assert.rejects(() => requestJson("/api/sections", {}, mockFetch), /Failed to fetch/);
});

test("4. DELETE thanh cong status 204 tra ve null", async () => {
  const mockFetch = async () => new Response(null, { status: 204 });
  const data = await requestJson("/api/enrollments/22000004/WEB-01", { method: "DELETE" }, mockFetch);
  assert.equal(data, null);
});

test("5. Phan hoi khong phai JSON nem loi ro rang", async () => {
  const mockFetch = async () =>
    new Response("<html>502 Bad Gateway</html>", {
      status: 502,
      headers: { "Content-Type": "text/html" },
    });
  await assert.rejects(() => requestJson("/api/sections", {}, mockFetch), /JSON/);
});

test("6. HTTP loi voi detail dang chuoi", async () => {
  const mockFetch = async () =>
    new Response(JSON.stringify({ detail: "Lop hoc phan da het cho" }), {
      status: 409,
      headers: { "Content-Type": "application/json" },
    });
  await assert.rejects(() => requestJson("/api/enrollments", {}, mockFetch), /Lop hoc phan da het cho/);
});

test("7. HTTP loi 422 voi detail la danh sach item.msg", async () => {
  const mockFetch = async () =>
    new Response(JSON.stringify({ detail: [{ msg: "Field required" }] }), {
      status: 422,
      headers: { "Content-Type": "application/json" },
    });
  await assert.rejects(() => requestJson("/api/enrollments", {}, mockFetch), /Field required/);
});

test("8. POST kem body duoc JSON.stringify va co Content-Type", async () => {
  let capturedOptions;
  const mockFetch = async (_url, opts) => {
    capturedOptions = opts;
    return new Response(JSON.stringify({ message: "OK" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  };
  await requestJson(
    "/api/enrollments",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: "22000004" }),
    },
    mockFetch
  );
  assert.equal(capturedOptions.headers["Content-Type"], "application/json");
  assert.equal(capturedOptions.body, '{"student_id":"22000004"}');
});