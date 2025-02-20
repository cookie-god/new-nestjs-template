export class DateUtil {
  /**
   * Date를 yyyy-MM-dd HH:mm:ss 형태로 변환해주는 함수
   */
  static formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월(0부터 시작)
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * yyyy-MM-dd로 변환해주는 함수
   */
  static makeYYYYMMDD(date: Date): string {
    return date
      .toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\. /g, '-')
      .replace('.', '');
  }

  /**
   * 요일 반환 함수
   */
  static getDayOfWeek(date: string) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const day = new Date(date).getDay();
    return days[day];
  }

  /**
   * 요일 반환 함수
   */
  static getDayOfWeekByDate(date: Date) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const day = date.getDay();
    return days[day];
  }
}
