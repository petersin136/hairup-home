"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Wordmark } from "@/components/brand/Wordmark";
import { SuppressEntryChrome } from "@/lib/entry-chrome";

/**
 * 상담 신청 개인정보 수집·이용 동의 — hu_register_10_pc / detail_01
 * 「상담 신청으로 돌아가기」→ 모달 폼 복원 (?consultation=1)
 */
export function ConsultationConsentClient() {
  const router = useRouter();

  function goBackToForm() {
    router.push("/?consultation=1");
  }

  return (
    <div className="CONSENT-PAGE">
      <SuppressEntryChrome />
      <div className="CONSENT-PAGE-INNER">
        <Link href="/?consultation=1" className="LOGO" aria-label="hair up">
          <Wordmark width={130} />
        </Link>

        <h1 className="TERMS-TITLE">개인정보 수집 및 이용 동의</h1>
        <p className="TERMS-DATE">시행일자: 2026. 09. 23</p>

        <hr className="TERMS-DIVIDER" />

        <section className="TERMS-SECTION">
          <h2 className="TERMS-SECTION-TITLE">
            1. 개인정보의 수집 및 이용 목적
          </h2>
          <p className="TERMS-SUBTEXT">
            헤어업(이하 &apos;회사&apos;)은 원장님의 매장 상황에 알맞은 최적의
            플랜 제안 및 원활한 상담 진행을 위해 아래의 목적으로 개인정보를
            수집·이용합니다.
          </p>
          <p className="TERMS-SUBTEXT">
            - 헤어업 1:1 맞춤 상담 신청 접수 및 본인 확인
          </p>
          <p className="TERMS-SUBTEXT">
            - 매장 상황(오픈 준비 중/운영 중) 및 지역별 특성에 따른 맞춤
            솔루션 플랜 안내
          </p>
          <p className="TERMS-SUBTEXT">
            - 상담 진행을 위한 유선 연락, 문자메시지, 카카오톡 알림톡 발송
          </p>
        </section>

        <hr className="TERMS-DIVIDER" />

        <section className="TERMS-SECTION">
          <h2 className="TERMS-SECTION-TITLE">2. 수집하는 개인정보 항목</h2>
          <p className="TERMS-SUBTEXT">
            회사는 1:1 맞춤 상담 신청을 위해 필요한 최소한의 개인정보를 수집하고
            있습니다.
          </p>
          <p className="TERMS-SUBTEXT">
            - 수집 항목: 성함, 연락처(휴대폰 번호), 매장 상태, 매장명,
            지역(시·구·동)
          </p>
          <p className="TERMS-SUBTEXT">
            - 수집 방법: 웹사이트 리드 폼 입력을 통한 직접 수집
          </p>
        </section>

        <hr className="TERMS-DIVIDER" />

        <section className="TERMS-SECTION">
          <h2 className="TERMS-SECTION-TITLE">
            3. 개인정보의 보유 및 이용 기간
          </h2>
          <p className="TERMS-SUBTEXT">
            원칙적으로 개인정보 수집 및 이용 목적이 달성되면 해당 정보를 지체
            없이 파기합니다. 단, 상담 이력 관리 및 원활한 후속 상담 안내를 위해
            상담 신청일로부터 1년간 보관 후 안전하게 파기합니다. 이용자가
            개인정보 삭제 또는 동의 철회를 요청하는 경우, 목적 달성 전이라도
            지체 없이 파기합니다.
          </p>
        </section>

        <hr className="TERMS-DIVIDER" />

        <section className="TERMS-SECTION">
          <h2 className="TERMS-SECTION-TITLE">
            4. 동의를 거부할 권리 및 거부에 따른 안내
          </h2>
          <p className="TERMS-SUBTEXT">
            이용자는 개인정보 수집 및 이용 동의를 거부할 권리가 있습니다. 다만,
            수집하는 항목은 1:1 맞춤 상담 제공을 위한 필수 정보이므로, 동의를
            거부하실 경우 맞춤 상담 신청 및 플랜 제안이 제한될 수 있습니다.
          </p>
        </section>

        <p className="TERMS-NOTICE">
          ※ 개인정보 관련 문의 및 동의 철회는 고객센터 또는 대표 이메일로
          요청하실 수 있습니다.
        </p>

        <button type="button" className="BTN-BACK" onClick={goBackToForm}>
          상담 신청으로 돌아가기
        </button>
      </div>
    </div>
  );
}
