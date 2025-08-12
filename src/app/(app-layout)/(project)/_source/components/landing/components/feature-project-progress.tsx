import FeatureLayout from './components/feature-layout'

const FeatureProjectProgress = () => {
  return (
    <section>
      <FeatureLayout
        badgeText={'두 번째'}
        title={`실시간으로 확인하는\n작업 진행 현황`}
        description={`실시간으로 프로젝트 진행 상황을 확인할 수 있어요.\n누구나 최신 상태를 바로 파악하고 협업할 수 있습니다.`}
        bgUrl={"bg-[url('/images/landing/section3_2_content.png')]"}
        bgColor={'bg-[linear-gradient(215deg,#D5E3FC_0.31%,#F6FAF6_104.05%)]'}
      />
    </section>
  )
}

export default FeatureProjectProgress
